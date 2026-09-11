import { ModelType } from '../types';

export function getModelDisplayName(model?: string, isMatany?: boolean): string {
  if (isMatany) return 'matany.one (Matany MAX)';
  if (!model) return 'Fathom Quant 3';

  switch (model) {
    case 'fathom-quant-3':
      return 'Fathom Quant 3';
    case 'fathom-cyber-ultra-2.6':
      return 'Fathom Cyber Ultra 2.6';
    case 'fathom-its-1':
      return 'Fathom ITS 1';
    case 'fathom-search':
      return 'Fathom Search';
    default:
      if (model.includes('its')) return 'Fathom ITS 1';
      if (model.includes('cyber') || model.includes('ultra')) return 'Fathom Cyber Ultra 2.6';
      if (model.includes('search')) return 'Fathom Search';
      return 'Fathom Quant 3';
  }
}

export function getModelSubtitle(model?: string, isMatany?: boolean): string {
  if (isMatany) {
    return 'وضع التحليل الحر غير المقيد للواقعية الموضوعية والنقد التحليلي الشامل';
  }
  switch (model) {
    case 'fathom-quant-3':
      return 'استدلال تحليلي فائق، توليد ومعالجة الصور بدقة عالية، والتحكم السحابي المتقدم';
    case 'fathom-cyber-ultra-2.6':
      return 'تفكير استدلالي وهندسة سيبرانية متقدمة واستنتاج عميق';
    case 'fathom-its-1':
      return 'أول منظومة تعليم لغات ذكية مستقلة في العالم بنظام CEFR والتكامل الصوتي';
    default:
      return 'استدلال تحليلي فائق، توليد ومعالجة الصور بدقة عالية، والتحكم السحابي المتقدم';
  }
}

export function getModelPlaceholder(
  model?: string,
  isMatany?: boolean,
  options?: {
    hasAttachments?: boolean;
    hasNonImageMedia?: boolean;
    isDeepSearch?: boolean;
    activeFusion?: { placeholder: string } | null;
  }
): string {
  if (options?.activeFusion?.placeholder) {
    return options.activeFusion.placeholder;
  }
  if (model === 'fathom-its-1') {
    return 'تحدث مع Fathom ITS 1 لتعلم الإنجليزية أو اسأل عن القواعد والتقييم اللغوي...';
  }
  if (model === 'fathom-search' || options?.isDeepSearch) {
    return 'ابحث واستقصِ بذكاء عبر Fathom Search (استعلام حي، سياق، ذاكرة، وفحص وسائط)...';
  }
  if (options?.hasNonImageMedia) {
    return 'أرفق وسائط لتحليلها أو اكتب استفسارك هنا...';
  }
  if (options?.hasAttachments) {
    return 'أرفق صورة للتحليل البصري أو اكتب استفسارك هنا...';
  }
  if (isMatany) {
    return 'اكتب استفسارك أو رسالتك هنا... (الوضع الحر)';
  }
  return 'اكتب استفسارك أو رسالتك هنا...';
}
