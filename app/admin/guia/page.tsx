'use client';

import { useRouter } from 'next/navigation';

export default function GuiaPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-none">iLABS Admin</h1>
            <p className="text-xs text-slate-500">Guia de uso</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="text-sm text-slate-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao painel
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-10">

        {/* Intro */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Guia do Painel iLABS</h2>
          <p className="text-slate-500">Tudo que você precisa saber para gerenciar o site sem precisar de um desenvolvedor.</p>
        </div>

        {/* Como entrar */}
        <GuiaSection
          number="1"
          title="Como fazer login"
          icon="🔐"
          steps={[
            'Acesse: www.ilabslaboratorio.com.br/admin',
            'Digite seu usuário e senha',
            'Clique em Entrar — você será redirecionado para o painel',
          ]}
          tip="Guarde seu usuário e senha em local seguro. Não compartilhe com pessoas fora da equipe."
        />

        {/* Banner */}
        <GuiaSection
          number="2"
          title='Aba "Banner" — Carrossel de imagens'
          icon="🖼️"
          description="Controla as imagens que aparecem no carrossel da página inicial."
          steps={[
            'Clique na aba Banner no topo do painel',
            'Para adicionar: faça upload de uma imagem ou cole uma URL, preencha o título e subtítulo e clique em Adicionar Slide',
            'O novo slide sempre aparece em primeiro no carrossel',
            'Para ocultar temporariamente: clique no ícone de olho — o slide some do site mas não é deletado',
            'Para remover definitivamente: clique no ícone de lixeira e confirme',
            'Para mudar a ordem: use as setas ▲▼ ao lado de cada slide',
          ]}
          tip="Imagens na proporção 2:1 (ex: 1200×600px) ficam com melhor aparência no carrossel."
        />

        {/* Campanhas */}
        <GuiaSection
          number="3"
          title="Como criar uma campanha"
          icon="📣"
          description="Campanhas são slides especiais com um badge colorido e data de validade automática."
          steps={[
            'Na aba Banner, adicione um slide normalmente',
            'Marque a opção Este slide é uma campanha',
            'Preencha o nome da campanha (ex: Campanha de Vacinação)',
            'Defina a data Válida até — quando passar essa data, o slide some do site automaticamente',
            'Clique em Adicionar Slide',
          ]}
          tip="Você não precisa lembrar de remover campanhas — o sistema remove sozinho na data definida."
        />

        {/* Texto Principal */}
        <GuiaSection
          number="4"
          title='Aba "Texto Principal" — Título do site'
          icon="✏️"
          description="Altera o título e subtítulo que aparecem na parte principal da página inicial."
          steps={[
            'Clique na aba Texto Principal',
            'Edite o campo Título — linha 1 (texto em preto)',
            'Edite o campo Título — palavra em destaque (aparece em verde abaixo)',
            'Edite o Subtítulo (parágrafo explicativo)',
            'Veja o Preview ao vivo logo abaixo dos campos',
            'Clique em Salvar Alterações',
          ]}
          tip="O botão fica escrito Salvo! por alguns segundos confirmando que foi gravado."
        />

        {/* Serviços */}
        <GuiaSection
          number="5"
          title='Aba "Serviços" — Lista de serviços'
          icon="🔬"
          description="Gerencia os cards de serviços exibidos na seção Nossos Serviços."
          steps={[
            'Clique na aba Serviços',
            'Para adicionar: preencha o nome, descrição e escolha um emoji como ícone, depois clique em Adicionar Serviço',
            'Para ocultar: clique no ícone de olho — o serviço some do site mas fica salvo',
            'Para remover: clique na lixeira e confirme',
            'Para mudar a ordem: use as setas ▲▼',
          ]}
          tip="Quando não há serviços cadastrados aqui, o site exibe automaticamente os serviços padrão do sistema."
        />

        {/* Dicas gerais */}
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6">
          <h3 className="font-bold text-primary-800 text-base mb-3 flex items-center gap-2">
            <span>💡</span> Dicas gerais
          </h3>
          <ul className="space-y-2 text-sm text-primary-900">
            <li className="flex gap-2"><span className="text-primary-400 font-bold">•</span>As alterações aparecem no site imediatamente após salvar</li>
            <li className="flex gap-2"><span className="text-primary-400 font-bold">•</span>Você pode ocultar um slide ou serviço sem deletar — assim fica fácil de reativar depois</li>
            <li className="flex gap-2"><span className="text-primary-400 font-bold">•</span>Campanhas com data de validade somem sozinhas — não precisa entrar no painel para remover</li>
            <li className="flex gap-2"><span className="text-primary-400 font-bold">•</span>Se algo sair errado, oculte o item em vez de deletar — é mais seguro</li>
            <li className="flex gap-2"><span className="text-primary-400 font-bold">•</span>Para sair do painel com segurança, clique em Sair no canto superior direito</li>
          </ul>
        </div>

        {/* Credenciais */}
        <div className="bg-slate-100 rounded-2xl p-6">
          <h3 className="font-bold text-slate-700 text-base mb-3 flex items-center gap-2">
            <span>🔑</span> Acesso ao painel
          </h3>
          <div className="text-sm text-slate-600 space-y-1">
            <p><span className="font-medium">URL:</span> www.ilabslaboratorio.com.br/admin</p>
            <p><span className="font-medium">Usuário marketing:</span> marketing</p>
            <p className="text-xs text-slate-400 mt-2">A senha foi fornecida separadamente pelo responsável técnico.</p>
          </div>
        </div>

      </main>
    </div>
  );
}

function GuiaSection({ number, title, icon, description, steps, tip }: {
  number: string;
  title: string;
  icon: string;
  description?: string;
  steps: string[];
  tip?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center font-bold text-base">
          {number}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-1">
            <span>{icon}</span> {title}
          </h3>
          {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
          <ol className="space-y-2 mt-3">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          {tip && (
            <div className="mt-4 flex gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              <span className="flex-shrink-0">⚠️</span>
              <span>{tip}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
