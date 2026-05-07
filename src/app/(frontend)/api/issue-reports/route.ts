import { NextResponse } from 'next/server'

import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unknown error'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const description = formData.get('description') as string
    const userId = formData.get('userId') as string
    const userEmail = formData.get('userEmail') as string
    const userName = formData.get('userName') as string
    const screenshot = formData.get('screenshot') as File | null

    // Validate required fields
    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    if (!userId || !userEmail || !userName) {
      return NextResponse.json(
        { error: 'User information is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })
    
    // Verify the user exists (basic validation)
    try {
      await payload.findByID({
        collection: 'users',
        id: userId,
      })
    } catch {
      return NextResponse.json(
        { error: 'Invalid user' },
        { status: 401 }
      )
    }

    // Upload screenshot if provided
    let screenshotId: string | undefined
    if (screenshot && screenshot.size > 0) {
      try {
        const arrayBuffer = await screenshot.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        const uploadedFile = await payload.create({
          collection: 'media',
          data: {},
          file: {
            data: buffer,
            mimetype: screenshot.type || 'image/jpeg',
            name: screenshot.name || 'screenshot.jpg',
            size: screenshot.size,
          },
        })
        
        screenshotId = typeof uploadedFile.id === 'string' ? uploadedFile.id : String(uploadedFile.id)
      } catch (uploadError) {
        console.error('Screenshot upload error:', uploadError)
        // Continue without screenshot if upload fails
      }
    }

    // Create issue report
    // Use overrideAccess: false to respect access control, but we need authenticated user
    // Since we're creating from an authenticated context, this should work
    try {
      // Auto-generate title from description
      const title = description.trim().substring(0, 50) + (description.trim().length > 50 ? '...' : '')
      
      // Use overrideAccess: true since we're in an API route without Payload request context
      // We've already validated the user exists above
      const report = await payload.create({
        collection: 'issue-reports',
        data: {
          title,
          description: description.trim(),
          userId,
          userEmail,
          userName,
          screenshot: screenshotId,
          status: 'pending',
        },
        overrideAccess: true, // Required for API routes without Payload request context
        context: {
          disableRevalidate: true,
        },
      })

      return NextResponse.json(
        { 
          success: true, 
          message: 'Issue report submitted successfully', 
          id: report.id 
        },
        { status: 200 }
      )
    } catch (createError: unknown) {
      console.error('Issue report creation error:', createError)
      return NextResponse.json(
        { 
          error: 'Failed to create issue report',
          details: getErrorMessage(createError)
        },
        { status: 500 }
      )
    }
  } catch (error: unknown) {
    console.error('Issue report submission error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to submit issue report',
        details: getErrorMessage(error)
      },
      { status: 500 }
    )
  }
}

