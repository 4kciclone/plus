import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F5F7] pt-[120px] pb-20">
        <div className="bg-[#080b12] py-12">
          <div className="container mx-auto px-6 lg:px-12">
            <h1 className="text-3xl font-extrabold text-white">Política de Privacidade</h1>
          </div>
        </div>
        <div className="container mx-auto px-6 lg:px-12 py-10 max-w-4xl">
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-8 md:p-12 prose prose-neutral max-w-none text-neutral-700 [&_h2]:text-neutral-900 [&_h2]:font-extrabold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2">

            <p>A Plus Multiplayer criou o aplicativo Plus Multiplayer como um aplicativo gratuito. Este SERVIÇO é fornecido pela Plus Multiplayer sem nenhum custo e deve ser usado como está.</p>

            <p>Esta página é usada para informar os visitantes do site sobre nossas políticas de coleta, uso e divulgação de Informações Pessoais, se alguém decidir usar nosso Serviço.</p>

            <p>Se você optar por usar nosso Serviço, concorda em coletar e usar informações em relação a esta política. As informações pessoais que coletamos são usadas para fornecer e melhorar o serviço. Não usaremos ou compartilharemos suas informações com ninguém, exceto conforme descrito nesta Política de Privacidade.</p>

            <h2>Coleta e uso de informações</h2>
            <p>Para uma melhor experiência ao usar nosso Serviço, podemos solicitar que você nos forneça certas informações de identificação pessoal, incluindo, entre outros, o nome do usuário, endereço, localização, fotos, dados de pagamentos. As informações que solicitamos são retidas no seu dispositivo e não são coletadas por nós de nenhuma forma, serão retidas por nós e usadas conforme descrito nesta política de privacidade.</p>
            <p>O aplicativo usa serviços de terceiros que podem coletar informações usadas para identificá-lo.</p>

            <h2>Dados de log</h2>
            <p>Queremos informar que, sempre que você usar nosso Serviço, em caso de erro no aplicativo, coletamos dados e informações (através de produtos de terceiros) no seu telefone chamado Log Data. Esses Dados de registro podem incluir informações como o endereço IP do seu dispositivo (&quot;IP&quot;), nome do dispositivo, versão do sistema operacional, configuração do aplicativo ao utilizar nosso Serviço, a hora e a data de seu uso do Serviço e outras estatísticas.</p>

            <h2>Cookies</h2>
            <p>Cookies são arquivos com pequena quantidade de dados que geralmente são usados como um identificador exclusivo anônimo. Este Serviço não usa esses &quot;cookies&quot; explicitamente. No entanto, o aplicativo pode usar código e bibliotecas de terceiros que usam &quot;cookies&quot; para coletar informações e melhorar seus serviços.</p>

            <h2>Provedores de serviço</h2>
            <p>Podemos empregar empresas e indivíduos de terceiros para facilitar nosso serviço, fornecer o serviço em nosso nome, executar serviços relacionados ou nos ajudar a analisar como nosso Serviço é usado.</p>

            <h2>Segurança</h2>
            <p>Valorizamos sua confiança em nos fornecer suas informações pessoais, portanto, estamos nos esforçando para usar meios comercialmente aceitáveis de protegê-las. Mas lembre-se de que nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro e confiável.</p>

            <h2>Links para outros sites</h2>
            <p>Este serviço pode conter links para outros sites. Se você clicar em um link de terceiros, será direcionado para esse site. Observe que esses sites externos não são operados por nós.</p>

            <h2>Privacidade das crianças</h2>
            <p>Estes serviços não tratam de menores de 13 anos. Não coletamos intencionalmente informações pessoais identificáveis de crianças menores de 13 anos.</p>

            <h2>Alterações a esta Política de Privacidade</h2>
            <p>Podemos atualizar nossa Política de Privacidade periodicamente. Essas alterações entram em vigor imediatamente após serem publicadas nesta página.</p>

            <h2>Contate-Nos</h2>
            <p>Se você tiver alguma dúvida ou sugestão sobre nossa Política de Privacidade, não hesite em nos contactar.</p>

            <div className="border-t border-neutral-100 mt-10 pt-8">
              <h2>Privacy Policy (English)</h2>
              <p>Plus Multiplayer created the Plus Multiplayer application as a free application. This SERVICE is provided by Plus Multiplayer at no cost and must be used as is.</p>
              <p>If you choose to use our Service, you agree to collect and use information in connection with this policy. The personal information we collect is used to provide and improve the service. We will not use or share your information with anyone except as described in this Privacy Policy.</p>
              <p>If you have any questions or suggestions about our Privacy Policy, don&apos;t hesitate to contact us.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
