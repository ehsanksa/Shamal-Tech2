'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, MessageCircle, RotateCcw, Home } from 'lucide-react'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'
import { translateUiString } from '../../lib/localization'
import './Chatbot.scss'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  options?: string[] // Clickable options/buttons
}

interface WebsiteData {
  services?: Array<{ id: string; title: string; slug: string; heroDescription?: string }>
  products?: Array<{ id: string; name: string; slug: string; description?: string }>
  blogs?: Array<{ id: string; title: string; slug: string; description?: string; date: string }>
  careers?: Array<{ id: string; title: string; slug: string; location: string; department: string }>
}

interface ConversationState {
  currentFlow?: 'services' | 'products' | 'blogs' | 'careers' | 'support' | null
  selectedItem?: string
  selectedItemId?: string
  waitingForSelection?: boolean
}

export function Chatbot() {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [websiteData, setWebsiteData] = useState<WebsiteData>({})
  const [conversationState, setConversationState] = useState<ConversationState>({
    currentFlow: null,
    selectedItem: undefined,
    selectedItemId: undefined,
    waitingForSelection: false,
  })
  const [showMainMenu, setShowMainMenu] = useState(true)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [selectedItem, setSelectedItem] = useState('')
  const [itemType, setItemType] = useState<'service' | 'product' | 'blog' | 'career' | 'support' | 'other'>('other')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch website data on mount
  useEffect(() => {
    if (isOpen && Object.keys(websiteData).length === 0) {
      fetchWebsiteData()
    }
  }, [isOpen])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const fetchWebsiteData = async () => {
    try {
      const response = await fetch('/api/chatbot')
      if (response.ok) {
        const data = await response.json()
        setWebsiteData(data)
      }
    } catch (error) {
      console.error('Error fetching website data:', error)
    }
  }

  const addMessage = (role: 'user' | 'assistant', content: string, options?: string[]) => {
    const newMessage: Message = {
      role,
      content,
      timestamp: new Date().toISOString(),
      options,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const sendMessage = async (content?: string) => {
    const messageContent = content || input.trim()
    if (!messageContent || isLoading) return

    // Add user message
    addMessage('user', messageContent)
    setInput('')
    setIsLoading(true)
    setShowMainMenu(false)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user' as const, content: messageContent },
          ],
          context: websiteData,
          conversationState,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      addMessage('assistant', data.message, data.options)

      // Update website data if provided
      if (data.context) {
        setWebsiteData(data.context)
      }

      // Update conversation state
      if (data.conversationState) {
        setConversationState(data.conversationState)
        if (data.conversationState.selectedItem) {
          setSelectedItem(data.conversationState.selectedItem)
          setItemType(
            (data.conversationState.currentFlow || 'other') as
              | 'service'
              | 'product'
              | 'blog'
              | 'career'
              | 'support'
              | 'other',
          )
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      addMessage(
        'assistant',
        "I'm sorry, I'm experiencing technical difficulties. Please try again or contact us at hello@shamal.sa",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleMainMenuSelection = (option: string) => {
    setShowMainMenu(false)
    let message = ''

    switch (option) {
      case 'services':
        message = 'I would like to know about your services'
        setItemType('service')
        break
      case 'products':
        message = 'I would like to know about your products'
        setItemType('product')
        break
      case 'blogs':
        message = 'Show me the latest blogs'
        setItemType('blog')
        break
      case 'careers':
        message = 'I would like to know about career opportunities'
        setItemType('career')
        break
      case 'support':
        message = 'I need customer support'
        setItemType('support')
        break
      case 'human':
        message = 'I would like to talk to a human representative'
        setItemType('support')
        break
      default:
        message = option
    }

    sendMessage(message)
  }

  const clearChat = (skipConfirm = false) => {
    if (!skipConfirm && !confirm(t.chatbot.clearConfirm)) {
      return
    }
    setMessages([])
    setShowMainMenu(true)
    setSelectedItem('')
    setItemType('other')
    setUserName('')
    setUserEmail('')
    setConversationState({
      currentFlow: null,
      selectedItem: undefined,
      selectedItemId: undefined,
      waitingForSelection: false,
    })
  }

  const startNewChat = () => {
    clearChat(true)
    addMessage('assistant', 'Hello 👋 Welcome to Shamal Technologies.\nHow may I help you today?')
    setShowMainMenu(true)
  }

  const backToMainMenu = () => {
    setShowMainMenu(true)
    setConversationState({
      currentFlow: null,
      selectedItem: undefined,
      selectedItemId: undefined,
      waitingForSelection: false,
    })
    addMessage('assistant', 'How may I help you today?')
  }

  const saveSummary = async () => {
    if (messages.length === 0) return

    // Extract key questions
    const keyQuestions = messages
      .filter((m) => m.role === 'user')
      .map((m) => m.content)
      .slice(0, 5)

    // Determine final outcome
    const lastUserMessage = messages.filter((m) => m.role === 'user').pop()?.content || ''
    const finalOutcome = lastUserMessage || 'General inquiry'

    try {
      await fetch('/api/chatbot/save-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName || undefined,
          userEmail: userEmail || undefined,
          selectedItem: selectedItem || undefined,
          itemType,
          conversation: messages,
          keyQuestions,
          finalOutcome,
        }),
      })
    } catch (error) {
      console.error('Error saving summary:', error)
    }
  }

  // Save summary when chat closes
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      saveSummary()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setShowMainMenu(true)
      // Add initial greeting with options
      const greetingMessage: Message = {
        role: 'assistant',
        content: t.chatbot.greeting,
        timestamp: new Date().toISOString(),
        options: ['Services', 'Products', 'Latest Blogs', 'Careers', 'Customer Support', 'Talk to a Human'],
      }
      setMessages([greetingMessage])
      setConversationState({
        currentFlow: null,
        selectedItem: undefined,
        selectedItemId: undefined,
        waitingForSelection: false,
      })
    }
  }, [isOpen, t.chatbot.greeting])

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          className="chatbot-toggle"
          onClick={() => setIsOpen(true)}
          aria-label={t.chatbot.open}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <h3>{language === 'ar' ? 'شمل للتقنيات' : 'Shamal Technologies'}</h3>
              <p>{t.chatbot.assistant}</p>
            </div>
            <button
              className="chatbot-close"
              onClick={() => {
                setIsOpen(false)
                saveSummary()
              }}
              aria-label={t.chatbot.close}
            >
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`chatbot-message chatbot-message-${message.role}`}>
                <div className="chatbot-message-content">{message.content}</div>
                {message.options && message.options.length > 0 && (
                  <div className="chatbot-options">
                    {message.options.map((option, optIndex) => (
                      <button
                        key={optIndex}
                        className="chatbot-option-button"
                        onClick={() => sendMessage(option)}
                        disabled={isLoading}
                      >
                        {translateUiString(option, language)}
                      </button>
                    ))}
                  </div>
                )}
                <div className="chatbot-message-time">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}


            {isLoading && (
              <div className="chatbot-message chatbot-message-assistant">
                <div className="chatbot-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-controls">
            <button onClick={backToMainMenu} title={t.chatbot.backToMenu} disabled={showMainMenu}>
              <Home size={16} />
            </button>
            <button onClick={startNewChat} title={t.chatbot.startNew}>
              <RotateCcw size={16} />
            </button>
            <button onClick={() => clearChat()} title={t.chatbot.clear}>
              {t.chatbot.clear}
            </button>
          </div>

          <div className="chatbot-input-container">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder={t.chatbot.placeholder}
              disabled={isLoading}
              className="chatbot-input"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="chatbot-send"
              aria-label={t.chatbot.send}
            >
              <Send size={18} />
            </button>
          </div>

          {messages.length > 0 && (
            <div className="chatbot-user-info">
              <input
                type="text"
                placeholder={t.chatbot.yourName}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="chatbot-user-input"
              />
              <input
                type="email"
                placeholder={t.chatbot.yourEmail}
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="chatbot-user-input"
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}

