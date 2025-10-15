import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, useTranslation } from "@/contexts/AuthContext";

// Mock data for demonstration
const securityPolicies = [
  {
    codigo: "SEC-001",
    nome: {
      en: "Password Policy",
      es: "Política de Contraseña",
      pt: "Política de Senha"
    },
    descricao: {
      en: "Defines the minimum requirements for user passwords.",
      es: "Define los requisitos mínimos para las contraseñas de los usuarios.",
      pt: "Define os requisitos mínimos para senhas de usuários."
    },
    dataVigencia: "2024-01-01",
    status: {
      en: "Active",
      es: "Activo",
      pt: "Ativa"
    },
    linkDocumento: "https://externo.com/politicas/SEC-001",
    categoria: {
      en: "Access",
      es: "Acceso",
      pt: "Acesso"
    }
  },
  {
    codigo: "SEC-002",
    nome: {
      en: "Backup Policy",
      es: "Política de Copias de Seguridad",
      pt: "Política de Backup"
    },
    descricao: {
      en: "Establishes guidelines for data backup and recovery.",
      es: "Establece directrices para la copia de seguridad y recuperación de datos.",
      pt: "Estabelece diretrizes para backup e recuperação de dados."
    },
    dataVigencia: "2023-06-01",
    status: {
      en: "Active",
      es: "Activo",
      pt: "Ativa"
    },
    linkDocumento: "https://externo.com/politicas/SEC-002",
    categoria: {
      en: "Backup",
      es: "Copia de Seguridad",
      pt: "Backup"
    }
  }
];

export default function SecurityPolicies() {
  const { t } = useTranslation();
  const { language } = useAuth();
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('securityPolicies')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">{t('logicalRecord')}</th>
                  <th className="px-4 py-2 border">{t('referencedItems')}</th>
                </tr>
              </thead>
              <tbody>
                {securityPolicies.map((policy) => (
                  <tr key={policy.codigo}>
                    <td className="px-4 py-2 border font-semibold">
                      {policy.nome[language]}
                    </td>
                    <td className="px-4 py-2 border text-left">
                      <div><b>{t('code')}:</b> {policy.codigo}</div>
                      <div><b>{t('description')}:</b> {policy.descricao[language]}</div>
                      <div><b>{t('effectiveDate')}:</b> {policy.dataVigencia}</div>
                      <div><b>{t('policyStatus')}:</b> {policy.status[language]}</div>
                      <div><b>{t('policyCategory')}:</b> {policy.categoria[language]}</div>
                      <div><b>{t('documentLink')}:</b> <a href={policy.linkDocumento} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{t('document')}</a></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
