import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-1 w-full pt-32 pb-20">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            Termos Legais
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-on-surface tracking-tight">
            Política de Privacidade
          </h1>
          <p className="text-on-surface-variant mt-4 text-lg">
            Saiba como protegemos seus dados e informações na Plus Internet.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-8 md:p-12 prose prose-neutral max-w-none text-on-surface-variant 
            [&_h2]:text-on-surface [&_h2]:font-extrabold [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 
            [&_p]:leading-relaxed [&_p]:mb-5 
            [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-3 [&_strong]:text-on-surface"
          >

            <p>A Plus Internet criou a plataforma digital como um serviço exclusivo aos assinantes e futuros clientes. Este SERVIÇO é fornecido pela Plus Internet sem nenhum custo e deve ser usado como está.</p>

            <p>Esta página é usada para informar os visitantes do site sobre nossas políticas de coleta, uso e divulgação de Informações Pessoais, se alguém decidir usar nosso Serviço.</p>

            <p>Se você optar por usar nosso Serviço, concorda com a coleta e uso de informações em relação a esta política. As informações pessoais que coletamos são usadas para fornecer e melhorar o serviço. Não usaremos ou compartilharemos suas informações com ninguém, exceto conforme descrito nesta Política de Privacidade.</p>

            <h2>Coleta e uso de informações</h2>
            <p>Para uma melhor experiência ao usar nosso Serviço, podemos solicitar que você nos forneça certas informações de identificação pessoal, incluindo, entre outros, o <strong>nome do usuário, endereço, localização, e-mail e dados de pagamento criptografados</strong>. As informações que solicitamos são retidas pela Plus Internet com a mais alta tecnologia de segurança e usadas conforme descrito nesta política de privacidade.</p>
            <p>O serviço utiliza ferramentas de terceiros (como Gateways de Pagamento) que podem coletar informações usadas para processar transações com segurança.</p>

            <h2>Dados de Diagnóstico</h2>
            <p>Abaixo detalhamos como tratamos as informações em caso de erros no aplicativo ou medições na rede. Podemos coletar dados e informações do seu roteador (via sistema gestor TR-069) chamados de "Dados de Diagnóstico". Esses dados podem incluir o endereço IP público, latência, tempo conectado (uptime), e atenuação da fibra (Potência Óptica).</p>

            <h2>Cookies</h2>
            <p>Cookies são arquivos com pequena quantidade de dados que geralmente são usados como um identificador exclusivo anônimo. Este Serviço utiliza "cookies" para gerenciar sessões do usuário conectado na Área do Assinante, bem como parâmetros de marketing para melhorar sua navegação pelos planos oferecidos.</p>

            <h2>Provedores de Serviço</h2>
            <p>Podemos empregar empresas e terceiros para facilitar nosso serviço financeiro, fornecer redes de streaming em parceria ou nos ajudar a analisar como nosso Serviço é usado (Data Analytics).</p>

            <h2>Segurança</h2>
            <p>Valorizamos sua confiança em nos fornecer suas informações pessoais, portanto, toda a sua conexão com a plataforma da Plus Internet utiliza os mais modernos protocolos de segurança em trânsito (SSL) e armazenamento. Embora nos esforcemos para garantir máxima proteção, lembre-se de que a segurança das suas senhas também depende do dispositivo utilizado no acesso.</p>

            <h2>Links para outros sites</h2>
            <p>Este serviço pode conter links externos (ex: Streaming Parceiro, Banco). Ao clicar nestes links, você será direcionado para o respectivo site.</p>

            <h2>Alterações a esta Política de Privacidade</h2>
            <p>Podemos atualizar nossa Política de Privacidade periodicamente para adequá-la às exigências da LGPD (Lei Geral de Proteção de Dados Pessoais). As alterações entram em vigor imediatamente após sua atualização nesta página.</p>

            <h2>Contato Oficial</h2>
            <p>Se você tiver alguma dúvida ou solicitaçãoLGPD referente aos seus dados, não hesite em nos contactar através da nossa <a href="/duvidas" className="text-primary font-bold hover:underline">Central de Dúvidas</a>.</p>

            <div className="border-t border-surface-container mt-12 pt-8">
              <h2>Privacy Policy (English Translation Outline)</h2>
              <p>Plus Internet operates this web platform as an essential service. We use your personal information solely to provide and improve the service. We will not use or share your information with anyone except as described in this Privacy Policy according to LGPD compliance.</p>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
