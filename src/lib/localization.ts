/**
 * Utility for localizing content based on language selection.
 * Returns Arabic content when language is 'ar' and Arabic content exists.
 * Known English UI labels are translated so Arabic pages never show leftover English chrome.
 */

import { commonTranslations } from './translations/common'

export type SupportedLanguage = 'en' | 'ar'

/** Extra CMS/default UI strings that are not in the shared translations object. */
const EXTRA_EN_TO_AR: Record<string, string> = {
  careers: 'الوظائف',
  'join our team': 'انضم إلى فريقنا',
  'get in touch': 'تواصل معنا',
  'get in touch with our team to discuss your project needs':
    'تواصل مع فريقنا لمناقشة احتياجات مشروعك',
  products: 'منتجات',
  'our products': 'منتجاتنا',
  'dji products': 'منتجات DJI',
  'contact us': 'تواصل معنا',
  'contact us today': 'تواصل معنا اليوم',
  'ready to get started?': 'هل أنت مستعد للبدء؟',
  'explore services': 'استكشف الخدمات',
  'our services': 'خدماتنا',
  'comprehensive solutions': 'حلول شاملة',
  'about shamal technologies': 'عن شمل للتقنيات',
  'our story': 'قصتنا',
  'who we are?': 'من نحن؟',
  'who we are': 'من نحن',
  'learn more about us': 'اعرف المزيد عنا',
  'blog posts': 'المدونة',
  blogs: 'المدونة',
  posts: 'المدونة',
  industries: 'القطاعات',
  'sectors we serve': 'القطاعات التي نخدمها',
  'our people': 'فريقنا',
  'meet the team driving the vision': 'تعرف على الفريق الذي يقود الرؤية',
  advantages: 'المزايا',
  'why choose shamal': 'لماذا شمل',
  'why choose us': 'لماذا تختارنا',
  'our impact': 'أثرنا',
  'delivering excellence across industries': 'نقدم التميز عبر القطاعات',
  partners: 'الشركاء',
  'our clients': 'عملاؤنا',
  'trusted by leading organizations': 'موثوقون من مؤسسات رائدة',
  'latest insights': 'أحدث الرؤى',
  'read all posts': 'اقرأ كل المقالات',
  training: 'التدريب',
  new: 'جديد',
  'on this page': 'في هذه الصفحة',
  'accreditations & compliance': 'الاعتمادات والامتثال',
  'full-time': 'دوام كامل',
  'full time': 'دوام كامل',
  'part-time': 'دوام جزئي',
  'part time': 'دوام جزئي',
  contract: 'عقد',
  internship: 'تدريب',
  permanent: 'دائم',
  remote: 'عن بُعد',
  hybrid: 'هجين',
  'on-site': 'في الموقع',
  onsite: 'في الموقع',
  jeddah: 'جدة',
  riyadh: 'الرياض',
  'saudi arabia': 'المملكة العربية السعودية',
  service: 'الخدمة',
  'career image': 'صورة الوظيفة',
  'careers hero background': 'خلفية صفحة الوظائف',
  'contact cta background': 'خلفية التواصل',
  'about preview background': 'خلفية نبذة عنا',
  'built upon over 25 years of industry experience, our team actively forms trusted partnerships, fosters a culture of innovation, and relentlessly pursues excellence.':
    'بخبرة تتجاوز 25 عاماً في القطاع، يبني فريقنا شراكات موثوقة ويعزز ثقافة الابتكار ويسعى بلا كلل نحو التميز.',
  'get started today': 'ابدأ اليوم',
  'learn more': 'اعرف المزيد',
  'read blog': 'اقرأ المدونة',
  insights: 'الرؤى',
  blog: 'المدونة',
  contact: 'تواصل معنا',
  'latest blogs': 'أحدث المقالات',
  'customer support': 'دعم العملاء',
  'talk to a human': 'تحدث مع ممثل',
  'customer service assistant': 'مساعد خدمة العملاء',
  'open chatbot': 'فتح المحادثة',
  'close chatbot': 'إغلاق المحادثة',
  'contact us on whatsapp': 'تواصل معنا عبر واتساب',
  'skip to policy content': 'انتقل إلى محتوى السياسة',
  'last updated': 'آخر تحديث',
  related: 'ذات صلة',
  'leading geospatial solutions provider': 'مزود رائد لحلول البيانات الجغرافية',
  'pioneering provider of drone and geospatial solutions in saudi arabia':
    'مزود رائد لحلول الطائرات بدون طيار والبيانات الجغرافية في المملكة العربية السعودية',
  male: 'ذكر',
  female: 'أنثى',
  'no preference': 'لا تفضيل',
  'no-preference': 'لا تفضيل',
  'human resources': 'الموارد البشرية',
  'information technology': 'تقنية المعلومات',
  engineering: 'الهندسة',
  sales: 'المبيعات',
  marketing: 'التسويق',
  operations: 'العمليات',
  finance: 'المالية',
  administration: 'الإدارة',
  certification: 'شهادة',
  'blog preview background': 'خلفية المدونة',
  'see other positions': 'عرض وظائف أخرى',
  'back to main menu': 'العودة إلى القائمة الرئيسية',
  'contact support': 'تواصل مع الدعم',
  'view products': 'عرض المنتجات',
  'view services': 'عرض الخدمات',
  'show more products': 'عرض المزيد من المنتجات',
  'privacy policy': 'سياسة الخصوصية',
  'terms & conditions': 'الشروط والأحكام',
  'terms and conditions': 'الشروط والأحكام',
  legal: 'قانوني',
  'aerial survey': 'المسح الجوي',
  'construction monitoring': 'مراقبة أعمال الإنشاء',
  'asset inspection': 'فحص الأصول',
  'bathymetric & underwater survey': 'المسح الباثيمتري وتحت الماء',
  'gis & remote sensing': 'نظم المعلومات الجغرافية والاستشعار عن بُعد',
  'environmental monitoring': 'المراقبة البيئية',
  'scan/cad to bim': 'تحويل SCAN/CAD إلى نماذج BIM',
  'mining & exploration': 'التعدين والاستكشاف',
  'security surveillance': 'المراقبة الأمنية',
  'ai application development': 'تطوير تطبيقات الذكاء الاصطناعي',
  'agriculture monitoring': 'مراقبة الزراعة',
  'special projects': 'المشاريع الخاصة',
  'traffic count & traffice analysis': 'عدّ المرور وتحليل الحركة المرورية',
  'traffic count & traffic analysis': 'عدّ المرور وتحليل الحركة المرورية',
}

function normalizeLookupKey(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

function collectPhraseMap(
  englishNode: unknown,
  arabicNode: unknown,
  map: Map<string, string>,
): void {
  if (typeof englishNode === 'string' && typeof arabicNode === 'string') {
    const key = normalizeLookupKey(englishNode)
    if (key) map.set(key, arabicNode)
    return
  }
  if (
    englishNode &&
    arabicNode &&
    typeof englishNode === 'object' &&
    typeof arabicNode === 'object' &&
    !Array.isArray(englishNode)
  ) {
    for (const key of Object.keys(englishNode as Record<string, unknown>)) {
      collectPhraseMap(
        (englishNode as Record<string, unknown>)[key],
        (arabicNode as Record<string, unknown>)[key],
        map,
      )
    }
  }
}

let phraseMap: Map<string, string> | null = null

function getPhraseMap(): Map<string, string> {
  if (phraseMap) return phraseMap
  phraseMap = new Map<string, string>()
  collectPhraseMap(commonTranslations.en, commonTranslations.ar, phraseMap)
  for (const [english, arabic] of Object.entries(EXTRA_EN_TO_AR)) {
    phraseMap.set(normalizeLookupKey(english), arabic)
  }
  return phraseMap
}

/** Translate a known English UI phrase when rendering Arabic pages. */
export function translateUiString(value: string, lang: SupportedLanguage): string {
  const trimmed = value.trim()
  if (!trimmed || lang !== 'ar') return trimmed
  return getPhraseMap().get(normalizeLookupKey(trimmed)) || trimmed
}

/**
 * Returns the appropriate localized string based on language.
 * On Arabic pages, known English UI labels are translated instead of leaking English.
 */
export function getLocalizedValue(
  en: string | null | undefined,
  ar: string | null | undefined,
  lang: SupportedLanguage,
): string {
  if (lang === 'ar') {
    const preferred = ar != null && ar.trim() !== '' ? ar.trim() : (en ?? '').trim()
    return translateUiString(preferred, 'ar')
  }
  return (en ?? '').trim() || (ar ?? '').trim() || ''
}
