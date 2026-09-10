import { ModelType } from '../types';

export function getModelDisplayName(model?: string, isMatany?: boolean): string {
  if (isMatany) return 'matany.one (Matany MAX)';
  if (!model) return 'Fathom Quant 3';

  switch (model) {
    case 'fathom-quant-3':
      return 'Fathom Quant 3';
    case 'fathom-cyber-ultra-2.6':
      return 'Fathom Cyber Ultra 2.6';
    case 'fathom-search':
      return 'Fathom Search';
    case 'meta/muse-spark-1.2':
    case 'meta/muse-spark-1.3':
    case 'meta/muse-spark-1.2-contributor':
    case 'meta/muse-spark-1.3-contributor':
      return 'Fathom Spark';
    default:
      if (model.includes('cyber') || model.includes('ultra')) return 'Fathom Cyber Ultra 2.6';
      if (model.includes('search') || model.includes('fathom-search')) return 'Fathom Search';
      if (model.includes('spark') || model.includes('muse')) return 'Fathom Spark';
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
    case 'fathom-search':
      return 'محرك البحث والاستقصاء المتشعب، واسترجاع الذاكرة العصبية وفحص وسائط الذكاء الاصطناعي';
    case 'meta/muse-spark-1.2':
    case 'meta/muse-spark-1.3':
    case 'meta/muse-spark-1.2-contributor':
    case 'meta/muse-spark-1.3-contributor':
      return 'معالجة الوسائط المتعددة: تفكيك وتحليل المقاطع الصوتية والمرئية';
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
