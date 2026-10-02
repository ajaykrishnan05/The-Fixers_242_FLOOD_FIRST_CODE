import type { Zone } from '../types'

export function englishAlert(zone: Zone): string {
  return `Flood warning for ${zone.name}: Heavy rain may cause waterlogging within the next 1–3 hours. Avoid ${zone.landmark}. Move documents, medicines and electrical items to a safe height. Follow local authority instructions.`
}

export function tamilAlert(zone: Zone): string {
  return `வெள்ள எச்சரிக்கை — ${zone.nameTa}: அடுத்த 1–3 மணி நேரத்தில் கனமழையால் நீர் தேக்கம் ஏற்படலாம். ${zone.landmarkTa} பகுதியை தவிர்க்கவும். ஆவணங்கள், மருந்துகள் மற்றும் மின்சாதனங்களை பாதுகாப்பான உயரமான இடத்திற்கு மாற்றவும். உள்ளாட்சி நிர்வாகத்தின் அறிவுரைகளை பின்பற்றவும்.`
}
