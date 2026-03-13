import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ChevronRight, Star, CheckCircle, ArrowRight, Gamepad2, Trophy, Coins } from 'lucide-react';

// --- DATA ---
const phase1Questions = [
  {
    question: "Qual é a sua maior dificuldade hoje para vender online?",
    options: ["Não sei por onde começar", "Crio conteúdo, mas não vende", "Falta de tempo", "Medo de aparecer"],
    feedback: "Interessante... muitas pessoas nessa fase ainda não descobriram como usar IA para acelerar a criação de conteúdo.",
    goal: "Com o método certo, pessoas nesse estágio costumam conseguir estruturar sua primeira loja e começar a validar vendas."
  },
  {
    question: "Como você se sente em relação à criação de conteúdo para o TikTok?",
    options: ["Totalmente perdido", "Sem ideias", "Demoro muito para editar", "Tenho vergonha"],
    feedback: "A boa notícia é que a Inteligência Artificial pode fazer o trabalho pesado por você, desde o roteiro até a edição.",
    goal: "Você pode criar dezenas de vídeos por semana sem precisar aparecer ou passar horas editando."
  },
  {
    question: "Você sente que tem uma estratégia clara para atrair clientes?",
    options: ["Nenhuma estratégia", "Tento algumas coisas, sem foco", "Tenho, mas não funciona", "Preciso de um passo a passo"],
    feedback: "A falta de estratégia é o que mais trava iniciantes. Ter um caminho validado economiza meses de tentativa e erro.",
    goal: "Um método claro permite que você foque apenas no que traz resultados reais."
  },
  {
    question: "O que mais te dá medo ao tentar vender na internet?",
    options: ["Perder tempo e não ter resultado", "Gastar dinheiro à toa", "Não saber usar as ferramentas", "Ficar para trás"],
    feedback: "Esse é um medo comum. É por isso que começar com ferramentas gratuitas de IA e tráfego orgânico no TikTok é a melhor escolha hoje.",
    goal: "Você pode validar produtos e ofertas sem investir em anúncios logo de cara."
  },
  {
    question: "Quanto tempo você tem disponível por dia para aplicar um novo método?",
    options: ["Menos de 1 hora", "1 a 2 horas", "2 a 4 horas", "Mais de 4 horas"],
    feedback: "Perfeito! Com a ajuda da IA, até mesmo quem tem pouco tempo consegue produzir conteúdo de alta qualidade e manter a consistência.",
    goal: "A consistência, aliada à IA, é o motor do crescimento no TikTok Shop."
  }
];

const phase2Questions = [
  {
    question: "Qual é o seu principal objetivo ao querer vender online?",
    options: ["Renda extra", "Substituir meu salário", "Liberdade de tempo", "Escalar um negócio existente"],
    feedback: "Perfis como o seu geralmente avançam muito quando têm acesso a um método estruturado e prompts de IA prontos.",
    goal: "O treinamento certo pode encurtar esse caminho e te dar clareza dos próximos passos."
  },
  {
    question: "O quanto você estaria disposto a usar IA para automatizar seu trabalho?",
    options: ["Muito, quero poupar tempo", "Um pouco, para ajudar nas ideias", "Quero aprender do zero", "Prefiro fazer tudo manual"],
    feedback: "A IA não substitui você, mas multiplica sua produtividade por 10x. Nosso treinamento foca exatamente nisso.",
    goal: "Você aprenderá a usar a IA como sua assistente pessoal 24/7."
  },
  {
    question: "Se você tivesse um método passo a passo hoje, o que faria?",
    options: ["Começaria agora mesmo", "Estudaria primeiro", "Aplicaria aos poucos", "Tentaria adaptar do meu jeito"],
    feedback: "A execução rápida é o segredo do TikTok. Ter um método pronto elimina a adivinhação e acelera seus resultados.",
    goal: "O curso fornece o mapa exato; você só precisa seguir."
  },
  {
    question: "Você percebe a urgência de aproveitar o TikTok Shop agora?",
    options: ["Sim, o momento é agora", "Estou começando a perceber", "Ainda tenho dúvidas", "Acho que já passou a onda"],
    feedback: "O timing é crucial. Quem se posiciona agora com IA está saindo na frente de 99% do mercado.",
    goal: "Aproveitar o 'boom' inicial de uma plataforma é a forma mais rápida de crescer."
  },
  {
    question: "O que você prefere vender usando essa estratégia?",
    options: ["Produtos físicos (Dropshipping)", "Produtos digitais (Cursos)", "Serviços", "Ainda não sei, quero descobrir"],
    feedback: "A estratégia de TikTok + IA funciona para qualquer um desses caminhos. Você está a um passo de descobrir como.",
    goal: "O método ensina a base sólida que funciona para qualquer nicho."
  }
];

const testimonials = [
  { name: "João S.", text: "Eu não sabia nada de edição. Com os prompts de IA do curso, fiz meu primeiro vídeo viral em 3 dias!" },
  { name: "Maria F.", text: "Trabalho o dia todo e só tenho 1h à noite. A IA me ajudou a criar minha loja e já fiz minhas primeiras vendas." },
  { name: "Carlos T.", text: "O passo a passo é muito claro. Antes eu perdia horas pensando no que postar, agora a IA faz o roteiro pra mim." }
];

// --- COMPONENTS ---

const PixelButton = ({ children, onClick, className = "", variant = "primary", disabled = false }: any) => {
  const baseStyle = "font-pixel text-xs sm:text-sm py-4 px-6 border-4 border-black uppercase transition-all flex items-center justify-center gap-2 text-center";
  const variants: any = {
    primary: "bg-[#e52521] hover:bg-[#ff3b30] text-white btn-retro", // Mario Red
    secondary: "bg-[#fbd000] hover:bg-[#ffea00] text-black btn-retro", // Coin Yellow
    option: "bg-white hover:bg-gray-100 text-black btn-retro",
    disabled: "bg-gray-400 text-gray-600 border-gray-500 cursor-not-allowed"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${disabled ? variants.disabled : variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const ProgressBar = ({ current, total }: { current: number, total: number }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between font-retro text-xl mb-2 text-white drop-shadow-md">
        <span>PROGRESSO</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-6 w-full bg-black border-4 border-black p-0.5">
        <div 
          className="h-full bg-[#43b047] transition-all duration-500 ease-out" // Luigi Green
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState("start"); // start, phase1, feedback1, video, phase2, feedback2, result, offer
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStart = () => {
    setStep("phase1");
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (answer: string) => {
    const currentPhase = step === "phase1" ? phase1Questions : phase2Questions;
    const q = currentPhase[currentQuestionIndex];
    
    setAnswers([...answers, { question: q.question, answer }]);
    
    // Go directly to next question or phase
    const isPhase1 = step === "phase1";
    const questions = isPhase1 ? phase1Questions : phase2Questions;
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (isPhase1) {
        setStep("video");
      } else {
        setStep("result");
      }
      setCurrentQuestionIndex(0);
    }
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Prevent seeking, speeding up
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Basic protection against seeking forward (not foolproof but works for simple UI)
      // For a real implementation, you'd track max time watched.
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [step]);


  const renderStart = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4"
    >
      <div className="bg-white/10 p-8 border-4 border-white backdrop-blur-sm mb-8 max-w-2xl w-full">
        <Gamepad2 className="w-20 h-20 mx-auto mb-6 text-[#fbd000] drop-shadow-[0_4px_0_rgba(0,0,0,1)]" />
        <h1 className="font-pixel text-2xl md:text-4xl leading-tight mb-6 text-white drop-shadow-[0_4px_0_rgba(0,0,0,1)]">
          Descubra como começar no TikTok Shop usando IA
        </h1>
        <p className="font-retro text-2xl md:text-3xl mb-8 text-blue-100">
          Responda algumas perguntas rápidas e veja como você pode começar a vender online.
        </p>
        <PixelButton onClick={handleStart} className="w-full md:w-auto mx-auto text-lg">
          COMEÇAR MISSÃO <ArrowRight className="w-6 h-6" />
        </PixelButton>
      </div>
    </motion.div>
  );

  const renderQuestion = () => {
    const isPhase1 = step === "phase1";
    const questions = isPhase1 ? phase1Questions : phase2Questions;
    const currentQ = questions[currentQuestionIndex];
    const totalQuestions = phase1Questions.length + phase2Questions.length;
    const currentProgress = isPhase1 ? currentQuestionIndex : phase1Questions.length + currentQuestionIndex;

    return (
      <motion.div 
        key={`q-${step}-${currentQuestionIndex}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="w-full max-w-2xl mx-auto px-4 py-8"
      >
        <ProgressBar current={currentProgress} total={totalQuestions} />
        
        <div className="bg-white text-black border-4 border-black p-6 md:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] mb-8">
          <div className="font-retro text-xl text-gray-500 mb-2 uppercase">
            Fase {isPhase1 ? '1' : '2'} - Nível {currentQuestionIndex + 1}
          </div>
          <h2 className="font-sans font-bold text-2xl md:text-3xl mb-8">
            {currentQ.question}
          </h2>
          
          <div className="flex flex-col gap-4">
            {currentQ.options.map((opt, idx) => (
              <PixelButton 
                key={idx} 
                variant="option" 
                onClick={() => handleAnswer(opt)}
                className="text-left justify-start font-sans font-semibold text-lg"
              >
                <div className="w-8 h-8 bg-gray-200 border-2 border-black flex items-center justify-center mr-2 font-pixel text-xs">
                  {String.fromCharCode(65 + idx)}
                </div>
                {opt}
              </PixelButton>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderFeedback = () => {
    const isPhase1 = step === "phase1";
    const questions = isPhase1 ? phase1Questions : phase2Questions;
    const currentQ = questions[currentQuestionIndex];

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto px-4 py-8"
      >
        <div className="bg-[#fbd000] text-black border-4 border-black p-6 md:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white p-3 border-4 border-black rounded-full">
              <Coins className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="font-pixel text-xl">Análise de Perfil</h3>
          </div>
          
          <div className="font-sans text-xl font-medium mb-6 bg-white/50 p-4 border-2 border-black">
            "{currentQ.feedback}"
          </div>
          
          <div className="font-retro text-2xl mb-8 flex items-start gap-2">
            <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0 text-green-700" />
            <p>{currentQ.goal}</p>
          </div>

          <PixelButton onClick={handleNextQuestion} className="w-full">
            PRÓXIMO NÍVEL <ChevronRight className="w-6 h-6" />
          </PixelButton>
        </div>
      </motion.div>
    );
  };

  const renderVideo = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto px-4 py-8 text-center"
    >
      <h2 className="font-pixel text-xl md:text-2xl text-white drop-shadow-[0_4px_0_rgba(0,0,0,1)] mb-8">
        Veja rapidamente como funciona na prática.
      </h2>
      
      <div className="bg-black border-8 border-gray-800 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-8 relative group">
        {/* Fake Video Element for Demo */}
        <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            src="https://iffburtdypbxswwyaipj.supabase.co/storage/v1/object/public/videos/ssstik.io_@daniellisouza.adv_1773360218522.mp4"
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
          
          {/* Custom Overlay Controls */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
            <button 
              onClick={toggleVideo}
              className="w-20 h-20 bg-[#e52521] border-4 border-black rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-[0_4px_0_rgba(0,0,0,1)]"
            >
              {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-2" />}
            </button>
          </div>
          
          {/* Block seeking overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>

      <PixelButton onClick={() => setStep("phase2")} variant="secondary" className="mx-auto">
        CONTINUAR MISSÃO <ArrowRight className="w-6 h-6" />
      </PixelButton>
    </motion.div>
  );

  const renderResult = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto px-4 py-8"
    >
      <div className="bg-white text-black border-4 border-black p-6 md:p-10 shadow-[8px_8px_0_0_rgba(0,0,0,1)] mb-8 text-center">
        <Trophy className="w-24 h-24 mx-auto mb-6 text-[#fbd000] drop-shadow-[0_4px_0_rgba(0,0,0,1)]" />
        
        <h2 className="font-pixel text-xl md:text-2xl mb-6 text-[#e52521]">
          Análise Concluída: Seu perfil mostra alto potencial para usar TikTok Shop com IA
        </h2>
        
        <div className="text-left font-sans mb-8">
          <div className="bg-blue-50 p-6 border-2 border-black mb-8">
            <h3 className="font-pixel text-sm mb-4 text-blue-800">Diagnóstico do Perfil</h3>
            <p className="mb-4">
              Com base nas suas respostas, notamos que você tem vontade de vender online, mas esbarra em obstáculos comuns como falta de tempo, estratégia ou dificuldade na criação de conteúdo.
            </p>
            <p className="mb-4">
              <strong>Seu Momento:</strong> Você está na fase ideal para adotar a Inteligência Artificial. A IA pode eliminar exatamente os gargalos que estão te travando hoje, automatizando o trabalho pesado.
            </p>
            <p>
              <strong>Metas Possíveis:</strong> Com o método certo, pessoas com o seu perfil costumam estruturar a primeira loja rapidamente, criar dezenas de vídeos por semana sem precisar aparecer, e começar a validar vendas em pouco tempo.
            </p>
          </div>

          <p className="text-lg mb-4 font-semibold">O que você vai aprender no treinamento:</p>
          <ul className="space-y-3 mb-6">
            {["Como estruturar sua loja no TikTok Shop", "Como usar IA para criar conteúdo infinito", "Como gerar vídeos que vendem no automático", "Como atrair clientes sem gastar com anúncios", "Como transformar visualizações em vendas reais"].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="text-gray-800">{item}</span>
              </li>
            ))}
          </ul>

          <div className="bg-gray-100 p-6 border-2 border-black">
            <p className="text-lg mb-4 font-semibold font-pixel text-sm">Benefícios Inclusos:</p>
            <div className="grid grid-cols-2 gap-4 font-retro text-xl">
              <div className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" /> Prompts Prontos</div>
              <div className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" /> Passo a Passo</div>
              <div className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" /> Estratégias Práticas</div>
              <div className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" /> Método Testado</div>
            </div>
          </div>
        </div>

        <PixelButton onClick={() => setStep("offer")} className="w-full text-lg py-6">
          VER OFERTA ESPECIAL <ArrowRight className="w-6 h-6" />
        </PixelButton>
      </div>

      {/* Social Proof */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white/90 border-4 border-black p-4 text-black">
            <div className="flex text-yellow-500 mb-2">
              {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="font-sans text-sm italic mb-2">"{t.text}"</p>
            <p className="font-retro text-lg font-bold">- {t.name}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderOffer = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4"
    >
      <div className="bg-[#fbd000] text-black border-8 border-black p-8 md:p-12 shadow-[12px_12px_0_0_rgba(0,0,0,1)] max-w-2xl w-full">
        <h1 className="font-pixel text-2xl md:text-4xl leading-tight mb-6 text-[#e52521] drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
          Acesse agora o treinamento completo
        </h1>
        
        <p className="font-sans text-xl md:text-2xl mb-10 font-medium">
          Se você quer aprender a usar TikTok Shop com IA para vender online com mais estratégia, essa pode ser a oportunidade certa.
        </p>
        
        <PixelButton 
          onClick={() => window.location.href = 'https://pay.kiwify.com.br/sXmri97?afid=JvGEJd4K'}
          className="w-full text-xl md:text-2xl py-6 animate-pulse"
        >
          QUERO ACESSAR AGORA
        </PixelButton>
        
        <p className="mt-6 font-retro text-xl text-gray-700">
          Acesso imediato • Risco Zero • Suporte Completo
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen font-sans bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] py-12">
      <AnimatePresence mode="wait">
        {step === "start" && renderStart()}
        {(step === "phase1" || step === "phase2") && renderQuestion()}
        {step === "video" && renderVideo()}
        {step === "result" && renderResult()}
        {step === "offer" && renderOffer()}
      </AnimatePresence>
    </div>
  );
}
