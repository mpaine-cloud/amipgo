import React, { useState, useRef } from "react";
import { ArrowLeft, Rocket, FileText, CheckCircle2, ChevronRight, X, Download } from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { Logo } from "../components/Logo";
import { db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import SEO from "../components/SEO";

type QuizState = {
  step: number;
  answers: {
    q1_trl?: string;
    q2_entorno?: string;
    q3_legal?: string;
    q4_ventas?: string;
    q5_objetivo?: string;
  };
};

const TRL_DESCRIPTIONS: Record<string, {trl: string, title: string, desc: string}> = {
  "trl_1_2": {
    trl: "TRL 1-2",
    title: "Idea o Concepto Puro",
    desc: "Aún no hay desarrollo, estás investigando o tienes la idea sobre el papel sin pruebas concretas."
  },
  "trl_3": {
    trl: "TRL 3",
    title: "Prueba de Concepto",
    desc: "Tenemos formulado el concepto y pruebas analíticas experimentales iniciales."
  },
  "trl_4": {
    trl: "TRL 4",
    title: "Prototipo de Laboratorio",
    desc: "Prototipo validado en entorno de laboratorio o ambiente controlado."
  },
  "trl_5_6": {
    trl: "TRL 5-6",
    title: "Prototipo Validados en Entorno Relevante",
    desc: "Tu prototipo ya ha sido probado en condiciones más reales (simuladas o con primeros usuarios piloto)."
  },
  "trl_7_plus": {
    trl: "TRL 7-9",
    title: "Comercializable / Escalable",
    desc: "El proyecto es operativo y estás listo para vender, o ya estás vendiendo y buscas escalar."
  }
};

const QUIZ_QUESTIONS = [
  {
    id: "q1_trl",
    title: "1. ¿En qué estado se encuentra el desarrollo de tu solución?",
    options: [
      { id: "A", label: "Apenas es una idea o estamos estudiando si es teóricamente posible.", value: "trl_1_2" },
      { id: "B", label: "Tenemos formulado el concepto y pruebas analíticas experimentales iniciales (Prueba de Concepto).", value: "trl_3" },
      { id: "C", label: "Tenemos un prototipo construido y funcional, pero requiere ajustes físicos/lógicos.", value: "trl_4_5" },
      { id: "D", label: "Tenemos un sistema/producto maduro operando y demostrable en las condiciones reales.", value: "trl_6_7" },
      { id: "E", label: "El producto final ha superado todas las pruebas, posee certificaciones y está operando exitosamente (o comercializándose).", value: "trl_8_9" },
    ]
  },
  {
    id: "q2_entorno",
    title: "2. ¿Dónde se ha probado tu solución actualmente?",
    options: [
      { id: "A", label: "No se ha probado aún, solo son estimaciones o diseños.", value: "trl_1_2" },
      { id: "B", label: "En un entorno de laboratorio o ambiente controlado/simulado.", value: "trl_4" },
      { id: "C", label: "En un entorno real (piloto), pero con un grupo de características limitadas.", value: "trl_5_6" },
      { id: "D", label: "En un entorno real, a escala completa, funcionando de manera continua.", value: "trl_7_plus" },
    ]
  },
  {
    id: "q3_legal",
    title: "3. ¿Cuál es el estatus legal actual del proyecto?",
    options: [
      { id: "A", label: "Postularemos como Persona Natural (Sin empresa creada).", value: "persona_natural" },
      { id: "B", label: "Empresa constituida hace menos de 18 meses.", value: "menos_18_meses" },
      { id: "C", label: "Empresa constituida hace más de 18 meses, pero menos de 3 años.", value: "menos_3_anos" },
      { id: "D", label: "Empresa constituida hace más de 3 años.", value: "mas_3_anos" },
    ]
  },
  {
    id: "q4_ventas",
    title: "4. Nivel de ventas de la solución o empresa (últimos 12 meses):",
    options: [
      { id: "A", label: "Sin ventas.", value: "sin_ventas" },
      { id: "B", label: "Ventas iniciales o esporádicas (Menor a $60 Millones CLP).", value: "menos_60m" },
      { id: "C", label: "Ventas constantes (Entre $60 Millones y $600 Millones CLP).", value: "menos_600m" },
      { id: "D", label: "Ventas sobre $600 Millones CLP.", value: "mas_600m" },
    ]
  },
  {
    id: "q5_objetivo",
    title: "5. ¿Qué buscas financiar principalmente con el fondo?",
    options: [
      { id: "A", label: "Desarrollar la tecnología, programar o construir desde el prototipo hacia adelante.", value: "desarrollo" },
      { id: "B", label: "Pilotear y validar mi producto con clientes reales para ajustarlo.", value: "piloto" },
      { id: "C", label: "Estrategias comerciales, marketing, empaquetamiento y ventas nacionales.", value: "comercial" },
      { id: "D", label: "Expandir y exportar mi solución validada a mercados internacionales.", value: "exportar" },
    ]
  }
];

const FUNDS = [
  {
    id: "crea-valida",
    name: "Crea y Valida (CORFO)",
    funding: "Hasta $220MM",
    description: "Financia el desarrollo, testeo y validación de productos/servicios de alta I+D+i.",
    match: (a: any, trl: string) => ["trl_3", "trl_4", "trl_5_6"].includes(trl) && ["menos_3_anos", "mas_3_anos"].includes(a.q3_legal) && a.q4_ventas !== "sin_ventas" && a.q5_objetivo === "desarrollo",
  },
  {
    id: "innova-region",
    name: "Innova Región (CORFO)",
    funding: "Hasta $60MM",
    description: "Apoya innovaciones de alcance regional, pasando desde prototipo a validación comercial.",
    match: (a: any, trl: string) => ["trl_4", "trl_5_6"].includes(trl) && a.q3_legal !== "persona_natural" && ["menos_60m", "menos_600m"].includes(a.q4_ventas) && ["piloto", "comercial"].includes(a.q5_objetivo),
  },
  {
    id: "semilla-inicia",
    name: "Semilla Inicia (CORFO)",
    funding: "Hasta $15MM",
    description: "Apoya a emprendimientos innovadores sin ventas a lograr su validación técnica y comercial temprana.",
    match: (a: any, trl: string) => ["trl_1_2", "trl_3", "trl_4"].includes(trl) && ["persona_natural", "menos_18_meses"].includes(a.q3_legal) && a.q4_ventas === "sin_ventas",
  },
  {
    id: "semilla-expande",
    name: "Semilla Expande (CORFO)",
    funding: "Hasta $45MM",
    description: "Apoya el despegue comercial y escalamiento de emprendimientos innovadores que ya tienen ventas.",
    match: (a: any, trl: string) => ["trl_5_6", "trl_7_plus"].includes(trl) && ["menos_3_anos", "mas_3_anos"].includes(a.q3_legal) && a.q4_ventas !== "sin_ventas" && ["comercial", "exportar"].includes(a.q5_objetivo),
  },
  {
    id: "sumate",
    name: "Súmate a Innovar (CORFO)",
    funding: "Hasta $10MM",
    description: "Voucher formativo para empresas maduras que desean iniciar proyectos de innovación tecnológica baja/media.",
    match: (a: any, trl: string) => a.q3_legal === "mas_3_anos" && ["desarrollo", "piloto"].includes(a.q5_objetivo),
  },
  {
    id: "semilla-abeja",
    name: "Capital Semilla / Abeja (SERCOTEC)",
    funding: "Hasta $3.5MM",
    description: "Apoya la puesta en marcha de nuevos negocios con oportunidad de participar en el mercado.",
    match: (a: any, trl: string) => ["trl_1_2", "trl_3", "trl_4"].includes(trl) && a.q3_legal === "persona_natural" && a.q4_ventas === "sin_ventas",
  },
  {
    id: "crece",
    name: "Crece (SERCOTEC)",
    funding: "Hasta $5MM",
    description: "Fondo para empresas que buscan crecer mediante inversión en capital de trabajo y gestión comercial.",
    match: (a: any, trl: string) => ["trl_7_plus"].includes(trl) && a.q3_legal !== "persona_natural" && a.q4_ventas !== "sin_ventas" && ["comercial", "exportar"].includes(a.q5_objetivo),
  }
];

const RUBRIC_CATEGORIES = [
  {
    id: "problema",
    title: "1. Problema/Desafío y Mercado (30%)",
    criteria: [
      "Magnitud del problema o desafío está cuantificada y justificada.",
      "Identificación clara de atributos del segmento de clientes o beneficiarios.",
      "Tamaño del mercado potencial está estimado y es atractivo.",
    ]
  },
  {
    id: "solucion",
    title: "2. Propuesta de Solución e Innovación (30%)",
    criteria: [
      "La solución resuelve directamente el problema planteado.",
      "El grado de diferenciación tecnológica/innovación está fundamentado respecto al estado del arte.",
      "El proyecto requiere inventar, investigar o desarrollar, lo que implica un riesgo técnico que justifica pedir este fondo.",
      "El modelo de negocios (o sostenibilidad) está proyectado y tiene sentido lógico."
    ]
  },
  {
    id: "equipo",
    title: "3. Capacidades y Equipo (20%)",
    criteria: [
      "El equipo emprendedor / técnico cuenta con dedicación y roles claros.",
      "Experiencia y capacidades complementarias para abordar el desafío.",
      "Redes de apoyo, mentores, o entidades colaboradoras confirmadas."
    ]
  },
  {
    id: "presupuesto",
    title: "4. Plan de Trabajo y Presupuesto (20%)",
    criteria: [
      "Los objetivos técnicos del plan son coherentes con las actividades descritas.",
      "El presupuesto guarda relación con la magnitud de las tareas a ejecutar.",
      "Se contemplan actividades para validación comercial o transferencia tecnológica."
    ]
  }
];

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<"quiz" | "rubrics">("quiz");
  
  // Quiz State
  const [quizState, setQuizState] = useState<QuizState>({ step: 0, answers: {} });
  
  // Rubrics State
  const [scores, setScores] = useState<Record<string, number>>({});
  const [, forceRender] = useState(0);

  const handleQuizSelect = (key: string, value: string) => {
    setQuizState(prev => {
      const newAnswers = { ...prev.answers, [key]: value };
      return {
        answers: newAnswers,
        step: prev.step + 1
      };
    });
  };

  const handleScoreChange = (catId: string, idx: number, value: number) => {
    setScores(prev => ({
      ...prev,
      [`${catId}-${idx}`]: value
    }));
  };

  let finalTrl = quizState.answers.q2_entorno || quizState.answers.q1_trl || "";
  if (quizState.answers.q1_trl === "trl_3" && quizState.answers.q2_entorno === "trl_1_2") {
    finalTrl = "trl_3"; 
  }

  const matches = quizState.step === QUIZ_QUESTIONS.length 
    ? FUNDS.filter(f => f.match(quizState.answers, finalTrl))
    : [];

  // Fallback if none matches directly or missing edge case
  const recommendedFunds = matches.length > 0 ? matches : FUNDS.filter(f => f.id === "semilla-inicia" || f.id === "innova-region" || f.id === "crece");

  const noneMessage = matches.length === 0 
    ? "No se identificó un fondo exacto (la combinación de madurez, ventas y características es atípica), pero podrías explorar o prepararte para los siguientes basales:" 
    : "Según tu nivel de madurez (TRL) y características, sugerimos los siguientes instrumentos de financiamiento.";

  // Generate dynamic rubrics based on recommended fund
  const activeFundId = recommendedFunds.length > 0 ? recommendedFunds[0].id : "default";

  const getDynamicRubrics = (fundId: string) => {
    if (fundId === "semilla-inicia") {
      return [
        {
          id: "problema",
          title: "1. Problema/Desafío y Mercado (30%)",
          criteria: [
            "Magnitud del problema o desafío está cuantificada y justificada.",
            "Identificación clara de atributos del segmento de clientes o beneficiarios.",
            "Tamaño del mercado potencial está estimado y es atractivo.",
          ]
        },
        {
          id: "solucion",
          title: "2. Propuesta de Solución e Innovación (30%)",
          criteria: [
            "La solución resuelve directamente el problema planteado.",
            "La solución posee una ventaja clara respecto a la oferta existente.",
            "El componente innovador responde a una necesidad latente del mercado.",
            "El modelo de ingresos preliminar está proyectado y tiene sentido lógico."
          ]
        },
        {
          id: "equipo",
          title: "3. Capacidades y Equipo (20%)",
          criteria: [
            "El equipo emprendedor cuenta con dedicación y roles claros.",
            "Experiencia y capacidades complementarias para abordar el desafío.",
            "Existe motivación y compromiso del equipo demostrable."
          ]
        },
        {
          id: "presupuesto",
          title: "4. Plan de Trabajo y Presupuesto (20%)",
          criteria: [
            "Las actividades para lograr la validación técnica y comercial son coherentes.",
            "El presupuesto detallado es razonable para la magnitud de las actividades."
          ]
        }
      ];
    } else if (fundId === "crea-valida") {
      return [
        {
          id: "problema",
          title: "1. Problema/Desafío Tecnológico y Mercado (30%)",
          criteria: [
            "El desafío tecnológico está claramente descrito y presenta una oportunidad comercial.",
            "Magnitud del problema o desafío está cuantificada y justificada.",
            "El estado de desarrollo actual (TRL) está evidenciado y bien fundamentado."
          ]
        },
        {
          id: "solucion",
          title: "2. Novedad y Grado de Innovación Tecnológica (30%)",
          criteria: [
            "El proyecto requiere inventar, investigar o desarrollar con alto riesgo técnico.",
            "Existe un avance significativo respecto del estado del arte (tecnológico).",
            "El modelo de negocios proyecta captura de valor a escala relevante."
          ]
        },
        {
          id: "equipo",
          title: "3. Capacidades y Equipo Técnico (20%)",
          criteria: [
            "El equipo cuenta con conocimiento experto comprobable en el área tecnológica.",
            "Capacidad técnica y de gestión para lidiar con la incertidumbre y el riesgo I+D."
          ]
        },
        {
          id: "presupuesto",
          title: "4. Metodología, Plan de Trabajo y Presupuesto (20%)",
          criteria: [
            "La metodología de I+D responde concretamente a la reducción de los riesgos técnicos.",
            "Los hitos técnicos permiten validar adecuadamente el logro de los objetivos."
          ]
        }
      ];
    }
    
    // Default Rubrics (Innova Region, Semilla Expande, Crece, etc.)
    return [
      {
        id: "problema",
        title: "1. Problema/Desafío y Mercado (30%)",
        criteria: [
          "Magnitud del problema o desafío está cuantificada y justificada.",
          "Identificación clara de atributos del segmento de clientes o beneficiarios.",
          "Tamaño del mercado potencial está estimado y es atractivo.",
        ]
      },
      {
        id: "solucion",
        title: "2. Propuesta de Solución e Innovación (30%)",
        criteria: [
          "La solución resuelve directamente el problema planteado.",
          "El grado de diferenciación o innovación está fundamentado respecto al estado del arte.",
          "El proyecto requiere investigación o desarrollo, lo que justifica pedir este fondo.",
          "El modelo de negocios comercial está proyectado y es viable."
        ]
      },
      {
        id: "equipo",
        title: "3. Capacidades y Equipo (20%)",
        criteria: [
          "El equipo emprendedor / técnico cuenta con dedicación y roles definidos.",
          "Cuentan con experiencia y capacidades complementarias para abordar el escalamiento.",
          "Redes de apoyo, mentores, o entidades colaboradoras confirmadas."
        ]
      },
      {
        id: "presupuesto",
        title: "4. Plan de Trabajo y Presupuesto (20%)",
        criteria: [
          "Los objetivos comerciales/técnicos del plan son coherentes con las actividades descritas.",
          "El presupuesto guarda relación con la magnitud de las tareas a ejecutar e impacto esperado."
        ]
      }
    ];
  };

  const dynamicRubrics = getDynamicRubrics(activeFundId);

  const calculateTotalScore = () => {
    let total = 0;
    dynamicRubrics.forEach(cat => {
      let catScore = 0;
      cat.criteria.forEach((_, i) => {
        catScore += scores[`${cat.id}-${i}`] || 0; // 1 to 5
      });
      const avgCat = catScore / cat.criteria.length; // max 5
      // weights: Problema: 30, Solucion: 30, Equipo: 20, Presupuesto: 20 (sum = 100)
      let weight = cat.id === "problema" || cat.id === "solucion" ? 0.3 : 0.2;
      total += avgCat * weight; 
    });
    // total is out of 5 based on weighted averages
    return ((total / 5) * 100).toFixed(1); 
  };

  const [isExporting, setIsExporting] = useState(false);
  const pdfPage1Ref = useRef<HTMLDivElement>(null);
  const pdfPage2Ref = useRef<HTMLDivElement>(null);
  
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState({ 
    name: "", 
    email: "", 
    whatsapp: "",
    acceptsPrivacy: false,
    acceptsMarketing: false
  });

  const handleExportClick = () => {
    setShowLeadModal(true);
  };

  const submitLeadAndExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.acceptsPrivacy) {
      alert("Debes aceptar la política de privacidad para continuar.");
      return;
    }
    try {
      setIsExporting(true);
      setShowLeadModal(false); // hide modal to show loading state
      
      const newLeadRef = doc(collection(db, "leads"));
      const leadData: any = {
        name: leadForm.name,
        email: leadForm.email,
        acceptsPrivacy: leadForm.acceptsPrivacy,
        acceptsMarketing: leadForm.acceptsMarketing,
        createdAt: Date.now()
      };
      
      if (leadForm.whatsapp.trim() !== '') {
         leadData.whatsapp = leadForm.whatsapp;
      }
      
      await setDoc(newLeadRef, leadData);

      await exportPDF();
    } catch (err) {
      console.error(err);
      alert("Hubo un error al registrar los datos.");
      setIsExporting(false);
    }
  };

  const exportPDF = async () => {
    if (!pdfPage1Ref.current || !pdfPage2Ref.current) return;
    try {
      // Delay to allow any font/layout to render
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const options = { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      };

      // Ensure explicit sizing to avoid truncation. A4 is 794x1123 at 96 DPI.
      pdfPage1Ref.current.style.height = 'max-content';
      pdfPage1Ref.current.style.width = '794px';
      pdfPage2Ref.current.style.height = 'max-content';
      pdfPage2Ref.current.style.width = '794px';

      const dataUrl1 = await toPng(pdfPage1Ref.current, options);
      const dataUrl2 = await toPng(pdfPage2Ref.current, options);

      pdfPage1Ref.current.style.height = 'auto';
      pdfPage1Ref.current.style.width = '100%';
      pdfPage2Ref.current.style.height = 'auto';
      pdfPage2Ref.current.style.width = '100%';

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps1 = pdf.getImageProperties(dataUrl1);
      let imgHeight1 = (imgProps1.height * pdfWidth) / imgProps1.width;
      let finalWidth1 = pdfWidth;
      if (imgHeight1 > pdfHeight) {
        finalWidth1 = (imgProps1.width * pdfHeight) / imgProps1.height;
        imgHeight1 = pdfHeight;
      }
      const xOffset1 = (pdfWidth - finalWidth1) / 2;
      pdf.addImage(dataUrl1, "PNG", xOffset1, 0, finalWidth1, imgHeight1);
      
      pdf.addPage();
      const imgProps2 = pdf.getImageProperties(dataUrl2);
      let imgHeight2 = (imgProps2.height * pdfWidth) / imgProps2.width;
      let finalWidth2 = pdfWidth;
      if (imgHeight2 > pdfHeight) {
        finalWidth2 = (imgProps2.width * pdfHeight) / imgProps2.height;
        imgHeight2 = pdfHeight;
      }
      const xOffset2 = (pdfWidth - finalWidth2) / 2;
      pdf.addImage(dataUrl2, "PNG", xOffset2, 0, finalWidth2, imgHeight2);

      pdf.save("reporte-estrategico-amipgo.pdf");
    } catch (err) {
      console.error("Error al exportar PDF:", err);
      // Fallback
      alert("Hubo un error al generar el PDF. Asegúrate de tener conexión a internet.")
    } finally {
      setIsExporting(false);
    }
  };

  const currentQuestion = QUIZ_QUESTIONS[quizState.step];

  return (
    <div className="min-h-screen bg-charcoal text-white pt-24 pb-32">
      <SEO 
        title="Workspace Estratégico | Calculadora TRL y Fondos | Amipgo"
        description="Utiliza nuestra Calculadora TRL y de Fondos para encontrar tu instrumento de financiamiento ideal, y el Simulador de Rúbricas para medir la competitividad de tu postulación."
        url="https://www.amipgo.com/workspace"
        keywords="workspace estrategico, calculadora trl, simulador corfo, evaluar proyecto, fondos corfo, fondos sercotec, checklist de postulacion, reporte estrategico"
      />
      <div className="max-w-6xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Volver al Inicio
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading mb-4">Workspace Estratégico</h1>
          <p className="text-xl text-white/60 font-sans max-w-3xl">
            Toma decisiones informadas antes de formular. Utiliza nuestra Calculadora TRL y de Fondos para encontrar tu instrumento ideal, y el Simulador de Rúbricas para autoevaluar tu propuesta.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row bg-black/20 p-2 rounded-xl border border-white/5 w-full sm:w-max mb-8 md:mb-12 gap-2">
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-4 sm:px-6 py-3 rounded-lg font-medium text-xs sm:text-sm transition-all focus:outline-none ${
              activeTab === "quiz" ? "bg-moss text-white shadow-lg" : "text-white/50 hover:text-white"
            }`}
          >
            1. Calculadora TRL y Fondos
          </button>
          <button
            onClick={() => {
              if (quizState.step === QUIZ_QUESTIONS.length) {
                setActiveTab("rubrics");
              }
            }}
            disabled={quizState.step !== QUIZ_QUESTIONS.length}
            title={quizState.step !== QUIZ_QUESTIONS.length ? "Completa la calculadora primero" : ""}
            className={`px-4 sm:px-6 py-3 rounded-lg font-medium text-xs sm:text-sm transition-all focus:outline-none ${
              activeTab === "rubrics" ? "bg-clay text-white shadow-lg" : 
              quizState.step === QUIZ_QUESTIONS.length ? "text-white/50 hover:text-white" : "text-white/20 cursor-not-allowed"
            }`}
          >
            2. Simulador de Puntaje
          </button>
        </div>

        {/* Tab 1: Decision Tree Quiz */}
        {activeTab === "quiz" && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-moss/20 text-moss rounded-xl flex items-center justify-center">
                <Rocket size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-heading">Calculadora TRL y Match de Fondos</h2>
                <p className="text-white/50 text-sm">Responde 5 preguntas clave para determinar tu madurez tecnológica y el instrumento ideal.</p>
              </div>
            </div>

            {quizState.step < QUIZ_QUESTIONS.length ? (
              <div className="max-w-2xl mt-12">
                <div className="flex gap-2 mb-6">
                  {QUIZ_QUESTIONS.map((_, i) => (
                    <div key={i} className={`h-2 flex-1 rounded-full ${i <= quizState.step ? 'bg-moss' : 'bg-white/10'}`} />
                  ))}
                </div>
                <h3 className="text-2xl font-medium mb-8 leading-tight">{currentQuestion.title}</h3>
                <div className="space-y-4">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleQuizSelect(currentQuestion.id, opt.value)}
                      className="w-full text-left p-6 rounded-xl border border-white/10 hover:border-moss hover:bg-moss/5 transition-all group flex items-center justify-between"
                    >
                      <span className="font-medium text-lg">{opt.label}</span>
                      <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity text-moss" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-12 animate-in fade-in zoom-in duration-500">
                
                {/* Result Block: TRL */}
                {finalTrl && TRL_DESCRIPTIONS[finalTrl] && (
                  <div className="bg-charcoal/50 border border-white/10 p-6 rounded-2xl mb-8">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/10 text-white font-mono px-3 py-1 rounded-md font-bold text-sm shrink-0">
                        {TRL_DESCRIPTIONS[finalTrl].trl}
                      </div>
                      <div>
                        <h4 className="font-bold text-xl font-heading mb-1">{TRL_DESCRIPTIONS[finalTrl].title}</h4>
                        <p className="text-white/70 text-sm">{TRL_DESCRIPTIONS[finalTrl].desc}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-moss/10 text-moss p-6 rounded-2xl border border-moss/20 inline-block mb-10 w-full sm:w-auto">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle2 size={20} /> Match Encontrado
                  </h3>
                  <p className="mt-2 text-white/80 max-w-lg text-sm">
                    {noneMessage}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {recommendedFunds.map((f, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                      <div className="font-mono text-xs uppercase tracking-widest text-clay mb-2">Instrumento Recomendado</div>
                      <h4 className="text-2xl font-bold font-heading mb-1">{f.name}</h4>
                      <p className="text-white/60 text-sm mb-4">Financiamiento: {f.funding}</p>
                      <p className="text-white/80 text-sm mb-6 leading-relaxed bg-black/20 p-4 rounded-xl">{f.description}</p>
                      
                      <button 
                        onClick={() => setActiveTab("rubrics")}
                        className="text-sm font-semibold flex items-center gap-1 hover:text-moss transition-colors"
                      >
                        Evaluar rúbrica <ArrowLeft size={16} className="rotate-180" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-12 border-t border-white/10 pt-8">
                  <button
                    onClick={() => setQuizState({ step: 0, answers: {} })}
                    className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm"
                  >
                    <X size={16} /> Volver a realizar el diagnóstico
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Rubrics Checklist */}
        {activeTab === "rubrics" && (
          <div className="bg-white text-charcoal rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-charcoal/5 rounded-xl flex items-center justify-center text-clay">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-heading">Simulador de Puntaje (Checklist Oficial)</h2>
                  <p className="text-black/50 text-sm mt-1">Evalúa tu postulación frente a las rúbricas tradicionales de CORFO.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs uppercase tracking-widest text-black/40 font-mono mb-1">Puntaje Estimado</div>
                  <div className="text-3xl font-bold text-moss">{calculateTotalScore()}%</div>
                </div>
                <button 
                  onClick={handleExportClick}
                  disabled={isExporting}
                  className={`bg-charcoal text-white hover:bg-black p-3 rounded-lg transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl ${isExporting ? 'opacity-70 cursor-wait' : 'active:scale-95'}`}
                  title="Exportar a PDF"
                >
                  <Download size={20} className={isExporting ? "animate-bounce" : ""} />
                  <span className="hidden sm:inline font-medium text-sm pr-2">
                    {isExporting ? "Generando..." : "Exportar"}
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-white p-4 -m-4">
              <div className="space-y-12">
                {dynamicRubrics.map((category) => (
                  <div key={category.id}>
                    <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-charcoal/10 inline-block">
                      {category.title}
                    </h3>
                    <div className="space-y-6">
                      {category.criteria.map((criterion, idx) => {
                        const scoreKey = `${category.id}-${idx}`;
                        const val = scores[scoreKey] || 0;
                        return (
                          <div key={idx} className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-charcoal/5 p-5 rounded-xl">
                            <p className="flex-1 font-medium text-charcoal/80 leading-relaxed text-sm md:text-base">
                              {criterion}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                  key={num}
                                  onClick={() => handleScoreChange(category.id, idx, num)}
                                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-mono text-xs sm:text-sm font-bold transition-all border ${
                                    val === num 
                                      ? "bg-clay text-white border-clay shadow-md scale-110" 
                                      : "bg-white text-charcoal/40 border-charcoal/20 hover:border-clay/50"
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-16 pt-8 border-t border-charcoal/10 text-center">
                <p className="text-black/40 text-sm max-w-2xl mx-auto">
                  Este simulador utiliza ponderaciones referenciales de los instrumentos CORFO. Un puntaje sobre 80% indica una propuesta altamente competitiva. Generado en Workspace Estratégico Amipgo.
                </p>
              </div>
            </div>
            
          </div>
        )}
      </div>

      {/* Hidden PDF export layout */}
      <div className="fixed top-[-9999px] left-[-9999px] flex flex-col gap-10 w-[794px] bg-white">
        {/* PAGE 1 */}
        <div ref={pdfPage1Ref} className="bg-white text-black w-full font-sans min-h-[1123px]" style={{ padding: "30px 50px" }}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b-2 border-black/10 pb-4">
            <Logo dark={false} className="text-4xl text-charcoal" />
            <div className="text-right">
              <h1 className="text-xl font-bold font-heading uppercase text-moss tracking-widest">Reporte Estratégico</h1>
              <p className="text-black/50 text-sm font-medium mt-1">
                {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Section 1: Diagnóstico */}
          <div className="mb-6">
            <h2 className="text-lg font-bold font-heading mb-4 text-clay border-b border-clay/20 pb-2">
              1. Calculadora TRL y Match de Fondos
            </h2>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4 bg-black/5 p-4 rounded-xl border border-black/5">
              {QUIZ_QUESTIONS.map(q => {
                const selectedValue = quizState.answers[q.id as keyof QuizState["answers"]];
                const selectedOption = q.options.find(o => o.value === selectedValue);
                return (
                  <div key={q.id}>
                    <p className="font-bold text-xs text-black/40 uppercase tracking-widest mb-1">{q.title}</p>
                    <p className="text-sm font-medium text-black/80">{selectedOption ? selectedOption.label : "Sin respuesta"}</p>
                  </div>
                );
              })}
            </div>

            {finalTrl && TRL_DESCRIPTIONS[finalTrl] && (
              <div className="bg-charcoal/5 p-4 rounded-xl mb-4">
                 <h3 className="font-bold text-sm text-charcoal mb-1">Nivel TRL Calculado: {TRL_DESCRIPTIONS[finalTrl].trl} - {TRL_DESCRIPTIONS[finalTrl].title}</h3>
                 <p className="text-xs text-black/60">{TRL_DESCRIPTIONS[finalTrl].desc}</p>
                 {matches.length === 0 && (
                   <div className="mt-3 pt-3 border-t border-black/10">
                     <p className="text-xs text-clay font-medium">{noneMessage}</p>
                   </div>
                 )}
              </div>
            )}
            
            <div className="bg-moss/10 border border-moss/20 p-4 rounded-xl">
              <h3 className="font-bold text-sm text-moss mb-3">Instrumentos Sugeridos:</h3>
              <div className="flex flex-wrap gap-2">
                {recommendedFunds.map(f => (
                  <span key={f.id} className="bg-white text-moss px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm">
                    {f.name} <span className="opacity-60 font-normal ml-1">({f.funding})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Rubricas (First Half) */}
          <div>
            <div className="flex justify-between items-end mb-4 border-b border-moss/20 pb-2">
              <h2 className="text-lg font-bold font-heading text-moss">
                2. Simulador de Puntaje
              </h2>
              <div className="text-lg font-bold">
                Puntaje Estimado: <span className="text-moss ml-1 bg-moss/10 px-3 py-1 rounded-md">{calculateTotalScore()}%</span>
              </div>
            </div>

            <div className="space-y-4">
              {dynamicRubrics.slice(0, 2).map(category => {
                let catScore = 0;
                category.criteria.forEach((_, i) => {
                  catScore += scores[`${category.id}-${i}`] || 0;
                });
                const avgCat = catScore / category.criteria.length;
                
                return (
                  <div key={category.id} className="bg-black/5 p-4 rounded-xl border border-black/5">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-sm text-black/80">{category.title}</h3>
                      <span className="font-bold font-mono text-sm bg-white px-2 py-1 rounded shadow-sm">
                        {((avgCat / 5) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="space-y-2">
                       {category.criteria.map((criterion, idx) => {
                          const scoreKey = `${category.id}-${idx}`;
                          const val = scores[scoreKey] || 0;
                          return (
                            <div key={idx} className="flex justify-between items-start text-xs border-t border-black/10 pt-2">
                               <span className="text-black/60 w-5/6 leading-relaxed align-middle pt-1">{criterion}</span>
                               <span className="font-bold w-6 h-6 bg-white border border-black/20 rounded flex items-center justify-center shrink-0">
                                 {val > 0 ? val : '-'}
                               </span>
                            </div>
                          )
                       })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* PAGE 2 */}
        <div ref={pdfPage2Ref} className="bg-white text-black w-full font-sans min-h-[1123px] flex flex-col" style={{ padding: "30px 50px" }}>
          
          {/* Header Mini */}
          <div className="flex justify-between items-center mb-6 border-b-2 border-black/10 pb-4 opacity-60">
            <Logo dark={false} className="text-2xl text-charcoal scale-75 origin-left" />
            <div className="text-right">
              <span className="text-xs font-bold font-heading uppercase text-moss tracking-widest">Reporte Estratégico (Cont.)</span>
            </div>
          </div>

          {/* Section 2: Rubricas (Second Half) */}
          <div className="flex-1">
            <div className="space-y-4">
              {dynamicRubrics.slice(2).map(category => {
                let catScore = 0;
                category.criteria.forEach((_, i) => {
                  catScore += scores[`${category.id}-${i}`] || 0;
                });
                const avgCat = catScore / category.criteria.length;
                
                return (
                  <div key={category.id} className="bg-black/5 p-4 rounded-xl border border-black/5">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-sm text-black/80">{category.title}</h3>
                      <span className="font-bold font-mono text-sm bg-white px-2 py-1 rounded shadow-sm">
                        {((avgCat / 5) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="space-y-2">
                       {category.criteria.map((criterion, idx) => {
                          const scoreKey = `${category.id}-${idx}`;
                          const val = scores[scoreKey] || 0;
                          return (
                            <div key={idx} className="flex justify-between items-start text-xs border-t border-black/10 pt-2">
                               <span className="text-black/60 w-5/6 leading-relaxed align-middle pt-1">{criterion}</span>
                               <span className="font-bold w-6 h-6 bg-white border border-black/20 rounded flex items-center justify-center shrink-0">
                                 {val > 0 ? val : '-'}
                               </span>
                            </div>
                          )
                       })}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Contact Action */}
            <div className="mt-12 bg-charcoal text-white p-8 rounded-2xl flex items-center gap-6 shadow-xl">
              <div className="w-16 h-16 bg-clay/20 flex items-center justify-center rounded-full shrink-0">
                <Rocket size={32} className="text-clay" />
              </div>
              <div>
                <h3 className="font-bold font-heading text-xl mb-2">¿Listo para dar el siguiente paso?</h3>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">
                  Si deseas documentar, profundizar y formular tu proyecto con un enfoque ganador, contáctanos. En AMIPGO somos expertos en acompañar a empresas y startups en la adjudicación de fondos CORFO.
                </p>
                <div className="inline-flex flex-col gap-1 text-sm">
                   <div className="flex items-center gap-2">
                     <span className="font-bold text-clay">Email:</span> 
                     <span className="text-white">contacto@amipgo.com</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="font-bold text-clay">Web:</span> 
                     <span className="text-white">amipgo.com</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-10 py-6 border-t-2 border-black/10 text-center">
            <p className="text-[10px] text-black/40 max-w-sm mx-auto leading-relaxed">
              Este simulador utiliza ponderaciones referenciales de los instrumentos CORFO. Un puntaje sobre 80% indica una propuesta altamente competitiva.
              <br/><br/>
              Generado de manera gratuita en <strong>amipgo.com/workspace</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Lead Form Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-black p-8 rounded-3xl max-w-md w-full relative shadow-2xl animate-fade-in-up">
            <button 
              onClick={() => setShowLeadModal(false)}
              className="absolute top-4 right-4 text-black/50 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-charcoal mb-2">Descarga tu Reporte</h2>
              <p className="text-sm text-black/60">
                Déjanos tus datos para enviarte una copia y habilitar la descarga inmediata de tu Reporte Estratégico.
              </p>
            </div>

            <form onSubmit={submitLeadAndExport} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss bg-black/5"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  required
                  value={leadForm.email}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss bg-black/5"
                  placeholder="juan@empresa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">WhatsApp <span className="text-black/40 font-normal">(Opcional)</span></label>
                <input 
                  type="tel" 
                  value={leadForm.whatsapp}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss bg-black/5"
                  placeholder="+56 9 1234 5678"
                />
              </div>
              
              <div className="flex flex-col gap-3 mt-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input 
                      type="checkbox" 
                      required
                      checked={leadForm.acceptsPrivacy}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, acceptsPrivacy: e.target.checked }))}
                      className="peer appearance-none w-5 h-5 border-2 border-black/20 rounded focus:outline-none focus:ring-2 focus:ring-moss/30 checked:bg-moss checked:border-moss transition-all"
                    />
                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-black/70 leading-relaxed pt-0.5 group-hover:text-black transition-colors">
                    Acepto el tratamiento de mis datos para recibir el reporte, según la <a href="/privacidad" target="_blank" className="font-semibold text-moss hover:underline">Política de Privacidad</a>.*
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input 
                      type="checkbox" 
                      checked={leadForm.acceptsMarketing}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, acceptsMarketing: e.target.checked }))}
                      className="peer appearance-none w-5 h-5 border-2 border-black/20 rounded focus:outline-none focus:ring-2 focus:ring-moss/30 checked:bg-moss checked:border-moss transition-all"
                    />
                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-black/70 leading-relaxed pt-0.5 group-hover:text-black transition-colors">
                    Acepto recibir correos y mensajes de WhatsApp con información comercial y promociones (Opcional).
                  </span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 bg-moss text-white py-4 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all mt-4"
              >
                {isExporting ? "Generando..." : "Descargar Reporte PDF"} <Download size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
