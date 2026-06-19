import { useI18n } from 'vue-i18n';

export function useDateFormatter() {
  const { locale } = useI18n();

  const formatarData = (valor: string | Date | null | undefined): string => {
    if (!valor) return '-';
    
    const data = new Date(valor);
    
    if (typeof valor === 'string' && !valor.includes('T')) {
      data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
    }

    return new Intl.DateTimeFormat(locale.value, {
      dateStyle: 'short'
    }).format(data);
  };

  return {
    formatarData
  };
}