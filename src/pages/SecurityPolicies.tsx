import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/AuthContext";

// Mock data for demonstration
const securityPolicies = [
  {
    codigo: "SEC-001",
    nome: "Política de Senha",
    descricao: "Define os requisitos mínimos para senhas de usuários.",
    dataVigencia: "2024-01-01",
    status: "Ativa",
    linkDocumento: "https://externo.com/politicas/SEC-001",
    categoria: "Acesso"
  },
  {
    codigo: "SEC-002",
    nome: "Política de Backup",
    descricao: "Estabelece diretrizes para backup e recuperação de dados.",
    dataVigencia: "2023-06-01",
    status: "Ativa",
    linkDocumento: "https://externo.com/politicas/SEC-002",
    categoria: "Backup"
  }
];

export default function SecurityPolicies() {
  const { t } = useTranslation();
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
                      {policy.nome}
                    </td>
                    <td className="px-4 py-2 border text-left">
                      <div><b>{t('code')}:</b> {policy.codigo}</div>
                      <div><b>{t('description')}:</b> {policy.descricao}</div>
                      <div><b>{t('effectiveDate')}:</b> {policy.dataVigencia}</div>
                      <div><b>{t('policyStatus')}:</b> {policy.status}</div>
                      <div><b>{t('policyCategory')}:</b> {policy.categoria}</div>
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
