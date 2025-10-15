import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Consulta de Políticas de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Registro Lógico</th>
                  <th className="px-4 py-2 border">Itens Referenciados</th>
                </tr>
              </thead>
              <tbody>
                {securityPolicies.map((policy) => (
                  <tr key={policy.codigo}>
                    <td className="px-4 py-2 border font-semibold">
                      {policy.nome}
                    </td>
                    <td className="px-4 py-2 border text-left">
                      <div><b>Código:</b> {policy.codigo}</div>
                      <div><b>Descrição:</b> {policy.descricao}</div>
                      <div><b>Data Vigência:</b> {policy.dataVigencia}</div>
                      <div><b>Status:</b> {policy.status}</div>
                      <div><b>Categoria:</b> {policy.categoria}</div>
                      <div><b>Link:</b> <a href={policy.linkDocumento} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Documento</a></div>
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
