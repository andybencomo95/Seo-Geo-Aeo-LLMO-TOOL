const P={
 seo:{n:"SEO",d:"Que Google y Bing te encuentren y te posicionen",c:"var(--seo)"},
 geo:{n:"GEO",d:"Que las IA generativas te citen en sus respuestas",c:"var(--geo)"},
 aeo:{n:"AEO",d:"Que seas la respuesta directa en snippets, voz e IA",c:"var(--aeo)"},
 llmo:{n:"LLMO",d:"Que los modelos de lenguaje te lean y te recuerden",c:"var(--llmo)"}
};
const Q=(c,s)=>c.d?[...c.d.querySelectorAll(s)]:[];
const ld=c=>{const t=[];Q(c,'script[type="application/ld+json"]').map(s=>s.textContent).concat(c.files.json).forEach(s=>{try{const walk=o=>{if(Array.isArray(o))return o.forEach(walk);if(o&&typeof o==="object"){if(o["@type"])[].concat(o["@type"]).forEach(x=>t.push(x));if(o["@graph"])walk(o["@graph"]);Object.values(o).forEach(v=>typeof v==="object"&&walk(v))}};walk(JSON.parse(s))}catch(e){}});return t};
const raw=c=>(c.d?c.d.documentElement.outerHTML:"")+c.files.json.join(" ");
const isQ=t=>/\?|^(qué|que|cómo|como|por qué|cuál|cual|cuándo|cuando|dónde|donde|cuánto|cuanto|what|how|why|when|which|where)\b/i.test(t.trim());
const AIB=["oai-searchbot","gptbot","chatgpt-user","claudebot","claude-searchbot","perplexitybot","google-extended"];
const blocked=r=>{const g=[];let cur=null,prev=false;r.split(/\r?\n/).forEach(l=>{l=l.replace(/#.*/,"").trim();const m=l.match(/^([a-z-]+)\s*:\s*(.*)$/i);if(!m)return;const k=m[1].toLowerCase(),v=m[2].trim();if(k==="user-agent"){if(!prev||!cur){cur={ua:[],dis:[],al:[]};g.push(cur)}cur.ua.push(v.toLowerCase());prev=true}else{prev=false;if(cur){if(k==="disallow")cur.dis.push(v);if(k==="allow")cur.al.push(v)}}});return AIB.filter(b=>{const grp=g.find(x=>x.ua.includes(b))||g.find(x=>x.ua.includes("*"));return grp&&grp.dis.includes("/")&&!grp.al.includes("/")})};
const ITEMS=[
{id:"s1",p:"seo",w:3,t:"La web usa HTTPS",why:"Es una señal básica de confianza y de ranking, y los navegadores avisan si falta.",how:"Instala un certificado (Let’s Encrypt es gratis) y redirige todo http:// a https:// con un 301.",a:c=>c.u.protocol==="https:"},
{id:"s2",p:"seo",w:1,t:"URL limpia, corta y en minúsculas",why:"Las URLs legibles se entienden mejor, se comparten más y evitan contenido duplicado.",how:"Usa guiones, sin parámetros innecesarios, máximo 3 o 4 niveles y una palabra clave principal.",a:c=>c.u.pathname.split("/").filter(Boolean).length<=4&&!/[A-Z_]/.test(c.u.pathname)&&c.u.searchParams.size<=1},
{id:"s3",p:"seo",w:3,t:"Etiqueta title de 30 a 65 caracteres con la palabra clave",why:"Es el factor on-page más influyente y el titular de tu resultado en Google.",how:"Pon la keyword al principio, sé específico y único en cada página.",a:c=>{if(!c.d)return;const t=(c.d.title||"").trim().length;return t>=30&&t<=65}},
{id:"s4",p:"seo",w:2,t:"Meta description de 70 a 160 caracteres",why:"No posiciona directamente, pero decide el clic y las IA la usan como resumen.",how:"Resume la promesa de la página con un verbo de acción y la keyword.",a:c=>{if(!c.d)return;const m=Q(c,'meta[name="description"]')[0];const l=m?(m.content||"").trim().length:0;return l>=70&&l<=160}},
{id:"s5",p:"seo",w:2,t:"Un único H1 y jerarquía H2/H3 lógica",why:"Los buscadores y las IA usan los encabezados para entender la estructura del tema.",how:"Un H1 con el tema principal; H2 por subtema; H3 por detalle. Sin saltos de nivel.",a:c=>c.d?Q(c,"h1").length===1&&Q(c,"h2").length>=2:undefined},
{id:"s6",p:"seo",w:2,t:"Etiqueta canonical",why:"Evita que variantes de la URL compitan entre sí.",how:'<link rel="canonical" href="URL-preferida">',a:c=>c.d?Q(c,'link[rel="canonical"]').length>0:undefined},
{id:"s7",p:"seo",w:2,t:"Viewport y diseño móvil",why:"Google indexa primero la versión móvil.",how:'<meta name="viewport" content="width=device-width, initial-scale=1"> y diseño responsive.',a:c=>c.d?Q(c,'meta[name="viewport"]').length>0:undefined},
{id:"s8",p:"seo",w:1,t:"Atributo lang en <html>",why:"Ayuda a servir la página al idioma y país correctos.",how:'<html lang="es"> y hreflang si tienes varios idiomas.',a:c=>c.d?!!c.d.documentElement.getAttribute("lang"):undefined},
{id:"s9",p:"seo",w:3,t:"La página no está bloqueada con noindex",why:"Un noindex la elimina del buscador por completo.",how:"Quita meta robots noindex y revisa la cabecera X-Robots-Tag.",a:c=>c.d?!/noindex/i.test(Q(c,'meta[name="robots"]').map(m=>m.content).join(" ")):undefined},
{id:"s10",p:"seo",w:1,t:"Imágenes con texto alternativo",why:"Accesibilidad, búsqueda de imágenes y contexto para las IA.",how:"Describe cada imagen con alt específico; alt vacío solo en decorativas.",a:c=>{if(!c.d)return;const i=Q(c,"img");return !i.length||i.filter(x=>(x.getAttribute("alt")||"").trim()).length/i.length>=.9}},
{id:"s11",p:"seo",w:2,t:"Enlaces internos (3 o más) con texto descriptivo",why:"Reparten autoridad y ayudan a rastrear y a entender los temas.",how:"Enlaza a páginas relacionadas con anclas descriptivas, nunca “haz clic aquí”.",a:c=>c.d?Q(c,"a[href]").filter(a=>{const h=a.getAttribute("href");return h&&!h.startsWith("#")&&!/^(mailto|tel|javascript):/.test(h)&&(!/^https?:/.test(h)||h.includes(c.u.hostname))}).length>=3:undefined},
{id:"s12",p:"seo",w:1,t:"Open Graph y Twitter Cards",why:"Mejoran el aspecto al compartir y el CTR social.",how:"og:title, og:description, og:image (1200×630) y twitter:card.",a:c=>c.d?Q(c,'meta[property="og:title"]').length>0&&Q(c,'meta[property="og:image"]').length>0:undefined},
{id:"s13",p:"seo",w:3,t:"Sitemap.xml enviado a Search Console y Bing Webmaster",why:"Acelera el descubrimiento e indexación de tus páginas.",how:"Genera /sitemap.xml, decláralo en robots.txt y envíalo en ambas consolas.",a:c=>{const f=c.files;if(f.sitemap)return /<loc>/i.test(f.sitemap);if(f.robots)return /^\s*sitemap:/im.test(f.robots)}},
{id:"s14",p:"seo",w:3,t:"Core Web Vitals en verde (LCP menor de 2,5 s, INP menor de 200 ms, CLS menor de 0,1)",why:"Velocidad y estabilidad influyen en ranking y en conversión.",how:"Mide en PageSpeed Insights; comprime imágenes (WebP/AVIF), carga diferida y menos JS."},
{id:"s15",p:"seo",w:3,t:"Enlaces entrantes de calidad",why:"Siguen siendo uno de los factores de autoridad más fuertes.",how:"Publica datos o recursos citables, haz relaciones públicas digitales y colaboraciones reales."},

{id:"g1",p:"geo",w:3,t:"Citas fuentes externas fiables (2 o más)",why:"Las IA generativas prefieren contenido que se apoya en fuentes verificables.",how:"Enlaza estudios, datos oficiales y documentación; atribuye cada cifra.",a:c=>c.d?Q(c,"a[href^=http]").filter(a=>!a.href.includes(c.u.hostname)).length>=2:undefined},
{id:"g2",p:"geo",w:3,t:"Autor y fecha visibles",why:"La autoría y la frescura son señales de confianza (E-E-A-T) para buscadores e IA.",how:"Firma con nombre, cargo y bio; muestra fecha de publicación y de actualización.",a:c=>c.d?(Q(c,'meta[name="author"]').length>0||Q(c,"time").length>0||/datePublished|"author"/.test(raw(c))):undefined},
{id:"g3",p:"geo",w:3,t:"Schema Organization o Person con sameAs",why:"Conecta tu marca con perfiles oficiales y consolida la entidad en los grafos de conocimiento.",how:"JSON-LD con name, url, logo y sameAs hacia LinkedIn, YouTube, X, Wikipedia o Wikidata (ver código abajo).",a:c=>(c.d||c.files.json.length)?ld(c).some(t=>/Organization|Person|LocalBusiness/.test(t))&&/sameAs/.test(raw(c)):undefined},
{id:"g4",p:"geo",w:2,t:"Estadísticas, datos concretos o citas textuales",why:"Los contenidos con cifras y citas se citan más en respuestas generativas.",how:"Incluye datos con fuente y año, porcentajes, ejemplos y citas de expertos.",a:c=>c.d?((c.text.match(/\d+([.,]\d+)?\s?%/g)||[]).length>=2||Q(c,"blockquote").length>0):undefined},
{id:"g5",p:"geo",w:2,t:"Contenido en profundidad (800 palabras o más)",why:"Cubrir el tema completo aumenta la probabilidad de ser fuente de referencia.",how:"Responde la intención principal y las preguntas relacionadas en una sola página.",a:c=>c.d?c.words>=800:undefined},
{id:"g6",p:"geo",w:2,t:"Señal de actualización (dateModified)",why:"Las IA con búsqueda priorizan contenido reciente.",how:"Revisa y actualiza tus páginas clave cada trimestre y refleja dateModified en el schema.",a:c=>c.d?/dateModified|article:modified_time/.test(raw(c)):undefined},
{id:"g7",p:"geo",w:3,t:"Datos o investigación original",why:"El contenido único es lo que las IA no pueden sustituir y por eso lo citan.",how:"Encuestas, benchmarks, casos reales y estudios propios con metodología visible."},
{id:"g8",p:"geo",w:3,t:"Menciones de tu marca fuera de tu web",why:"Los modelos aprenden de Reddit, Wikipedia, reseñas, prensa y foros.",how:"Participa con valor real en comunidades, consigue reseñas y presencia en prensa y directorios del sector."},
{id:"g9",p:"geo",w:2,t:"Frases claras sobre quién eres y qué haces",why:"Una definición explícita de tu entidad evita que la IA te confunda o te ignore.",how:"Escribe “[Marca] es [categoría] que ayuda a [público] a [resultado]” en home, about y bios."},

{id:"a1",p:"aeo",w:3,t:"Schema FAQPage, HowTo o QAPage",why:"Marca explícitamente preguntas y respuestas para buscadores y asistentes.",how:"Añade JSON-LD con preguntas reales que ya aparecen en la página (ver código abajo).",a:c=>(c.d||c.files.json.length)?ld(c).some(t=>/FAQPage|HowTo|QAPage/.test(t)):undefined},
{id:"a2",p:"aeo",w:3,t:"Encabezados formulados como preguntas (2 o más)",why:"Coinciden con cómo la gente pregunta por voz y en chats de IA.",how:"Usa H2 o H3 como “¿Cómo…?”, “¿Qué es…?”, “¿Cuánto cuesta…?”.",a:c=>c.d?Q(c,"h2,h3").filter(h=>isQ(h.textContent)).length>=2:undefined},
{id:"a3",p:"aeo",w:3,t:"Respuesta directa de 15 a 60 palabras bajo cada pregunta",why:"Los featured snippets y las respuestas de IA extraen el primer párrafo conciso.",how:"Responde en la primera frase y desarrolla después. Evita rodeos.",a:c=>{if(!c.d)return;let n=0;Q(c,"h2,h3").forEach(h=>{let e=h.nextElementSibling;if(e&&e.tagName==="P"){const w=e.textContent.trim().split(/\s+/).length;if(w>=15&&w<=60)n++}});return n>=2}},
{id:"a4",p:"aeo",w:2,t:"Listas, pasos y tablas",why:"Formatos que los motores de respuesta reutilizan tal cual.",how:"Listas numeradas para procesos, viñetas para opciones y tablas para comparar.",a:c=>c.d?Q(c,"ul,ol,table").length>=1:undefined},
{id:"a5",p:"aeo",w:2,t:"Preguntas reales investigadas (People Also Ask, AnswerThePublic, soporte)",why:"Responder lo que realmente se pregunta es la base del AEO.",how:"Recopila preguntas de Google, de tu buscador interno y de tus clientes, y créales una sección."},
{id:"a6",p:"aeo",w:1,t:"Resumen al inicio (TL;DR) y marcado speakable",why:"Facilita las respuestas por voz y los resúmenes automáticos.",how:"Párrafo de 2 o 3 frases al principio; opcionalmente schema speakable."},

{id:"l1",p:"llmo",w:3,t:"robots.txt permite los rastreadores de IA que te interesan",why:"Si bloqueas GPTBot, ClaudeBot o PerplexityBot, esos modelos no podrán citarte.",how:"Permite OAI-SearchBot, GPTBot, ClaudeBot, PerplexityBot y Google-Extended (ver código abajo).",a:c=>c.files.robots?blocked(c.files.robots).length===0:undefined},
{id:"l2",p:"llmo",w:2,t:"Archivo /llms.txt",why:"Propuesta emergente que da a los modelos un mapa claro de tu contenido clave.",how:"Publica /llms.txt en Markdown con resumen y enlaces a tus páginas esenciales (ver código abajo).",a:c=>c.files.llms?/^#\s/m.test(c.files.llms)&&/\]\(https?:/.test(c.files.llms):undefined},
{id:"l3",p:"llmo",w:3,t:"El contenido está en el HTML inicial (no depende de JavaScript)",why:"Muchos rastreadores de IA no ejecutan JS y verían tu página vacía.",how:"Usa SSR, SSG o prerender; comprueba con Ver código fuente que el texto está ahí.",a:c=>c.d?c.words>=300:undefined},
{id:"l4",p:"llmo",w:2,t:"HTML semántico (main, article, encabezados)",why:"Ayuda a separar el contenido útil del ruido al trocear el texto.",how:"Envuelve el contenido en <main> y <article>, usa <nav>, <section> y encabezados ordenados.",a:c=>c.d?(Q(c,"main,article").length>0&&Q(c,"h1,h2,h3").length>=3):undefined},
{id:"l5",p:"llmo",w:2,t:"Datos estructurados JSON-LD presentes",why:"Dan hechos sin ambigüedad sobre tu marca, productos y contenido.",how:"Organization, WebSite, Article, Product, FAQPage según el tipo de página.",a:c=>(c.d||c.files.json.length)?ld(c).length>0:undefined},
{id:"l6",p:"llmo",w:2,t:"Terminología coherente y definiciones claras",why:"Nombrar siempre igual a tu marca, producto y conceptos refuerza la asociación en los modelos.",how:"Usa un nombre oficial único, define cada término técnico y crea un glosario."},
{id:"l7",p:"llmo",w:2,t:"Contenido clave accesible sin login, popups ni pestañas ocultas",why:"Lo que un rastreador no puede abrir, un modelo no lo aprende.",how:"Deja precios, FAQs y documentación en texto visible en la página."},
{id:"l8",p:"llmo",w:3,t:"Medir tu presencia en ChatGPT, Gemini, Claude y Perplexity",why:"Lo que no se mide no mejora: hay que saber si te citan.",how:"Lanza cada mes 20 preguntas de tu sector en cada asistente y anota si apareces y con qué fuente."}
];
const $=id=>document.getElementById(id);
let st={},auto={},ctx=null,tab=0;

function parse(){
  let v=$("url").value.trim();if(!v)throw new Error("Escribe una URL.");
  if(!/^https?:\/\//i.test(v))v="https://"+v;
  let u;try{u=new URL(v);if(!u.hostname.includes("."))throw 0}catch(e){throw new Error("Esa URL no parece válida. Prueba con https://tuweb.com")}
  const h=$("html").value.trim();let d=null,text="",words=0;
  if(h){d=new DOMParser().parseFromString(h,"text/html");const k=d.cloneNode(true);k.querySelectorAll("script,style,noscript").forEach(e=>e.remove());text=(k.body?k.body.textContent:"").replace(/\s+/g," ").trim();words=text?text.split(" ").length:0}
  return{u,d,text,words,files:FILES};
}
function score(p){let a=0,b=0;ITEMS.filter(i=>i.p===p).forEach(i=>{b+=i.w;if(st[i.id])a+=i.w});return Math.round(a/b*100)}
function paint(){
  $("lanes").innerHTML=Object.keys(P).map(k=>{
    const its=ITEMS.filter(i=>i.p===k);
    return `<div class="lane" style="--c:${P[k].c}"><div class="lh"><b>${P[k].n}</b><span>${P[k].d}</span><em style="color:${P[k].c}">${score(k)}%</em></div><div class="strip">${its.map(i=>`<i class="${st[i.id]?"on":""}" style="flex:${i.w}" title="${i.t}"></i>`).join("")}</div></div>`}).join("");
  const todo=ITEMS.filter(i=>!st[i.id]).sort((a,b)=>b.w-a.w).slice(0,6);
  $("pri").innerHTML=todo.length?todo.map(i=>`<li style="--c:${P[i.p].c}"><b>${i.t}</b><small>${P[i.p].n} · ${i.how}</small></li>`).join(""):"<li style=\"--c:var(--ok)\"><b>Cobertura completa.</b><small>Mantén el contenido actualizado y mide tus citaciones cada mes.</small></li>";
}
function build(){
  $("list").innerHTML=Object.keys(P).map(k=>`<h3 style="color:${P[k].c}">${P[k].n}</h3>`+ITEMS.filter(i=>i.p===k).map(i=>`<div class="it" style="--c:${P[k].c}"><input type="checkbox" id="c_${i.id}" data-id="${i.id}" ${st[i.id]?"checked":""}><div><label for="c_${i.id}">${i.t}</label><span class="tag">${auto[i.id]?"detectado":"manual"}</span><span class="tag">impacto ${["","bajo","medio","alto"][i.w]}</span><details><summary>Por qué y cómo</summary><p>${i.why}</p><p><b>Cómo:</b> ${i.how}</p></details></div></div>`).join("")).join("");
}
function codes(){
  const u=ctx.u,o=u.origin,n=u.hostname.replace(/^www\./,"").split(".")[0].replace(/^./,x=>x.toUpperCase());
  const ldj={"@context":"https://schema.org","@graph":[
   {"@type":"Organization","@id":o+"/#org","name":n,"url":o+"/","logo":o+"/logo.png","sameAs":["https://www.linkedin.com/company/TU-MARCA","https://www.youtube.com/@TU-MARCA","https://x.com/TU-MARCA"]},
   {"@type":"WebSite","@id":o+"/#web","url":o+"/","name":n,"inLanguage":"es","publisher":{"@id":o+"/#org"}},
   {"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"¿Qué es "+n+"?","acceptedAnswer":{"@type":"Answer","text":n+" es [categoría] que ayuda a [público] a [resultado]. Responde aquí en una o dos frases."}},{"@type":"Question","name":"¿Cuánto cuesta?","acceptedAnswer":{"@type":"Answer","text":"Indica el precio o rango con claridad."}}]}]};
  return[
   {n:"JSON-LD",t:'<script type="application/ld+json">\n'+JSON.stringify(ldj,null,2)+'\n<\/script>'},
   {n:"robots.txt",t:"User-agent: *\nAllow: /\n\n# Búsqueda y respuestas de IA\nUser-agent: OAI-SearchBot\nAllow: /\nUser-agent: ChatGPT-User\nAllow: /\nUser-agent: GPTBot\nAllow: /\nUser-agent: ClaudeBot\nAllow: /\nUser-agent: Claude-SearchBot\nAllow: /\nUser-agent: PerplexityBot\nAllow: /\nUser-agent: Google-Extended\nAllow: /\nUser-agent: Applebot-Extended\nAllow: /\n\nSitemap: "+o+"/sitemap.xml"},
   {n:"llms.txt",t:"# "+n+"\n\n> "+n+" es [categoría] que ayuda a [público] a [resultado]. Resumen en una frase.\n\n## Páginas clave\n- ["+"Inicio]("+o+"/): qué hacemos y para quién\n- [Productos o servicios]("+o+"/servicios): descripción y precios\n- [Preguntas frecuentes]("+o+"/faq): respuestas directas\n- [Blog]("+o+"/blog): guías y datos originales\n\n## Contacto\n- [Contacto]("+o+"/contacto)"},
   {n:"Meta tags",t:'<title>Keyword principal: beneficio claro | '+n+'</title>\n<meta name="description" content="Resume la promesa en 120-155 caracteres con la keyword.">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<link rel="canonical" href="'+u.href.split("#")[0]+'">\n<meta property="og:title" content="Título para compartir">\n<meta property="og:description" content="Descripción para compartir">\n<meta property="og:image" content="'+o+'/og.jpg">\n<meta name="twitter:card" content="summary_large_image">'}
  ];
}
function showCode(){
  const c=codes();
  $("tabs").innerHTML=c.map((x,i)=>`<button class="tab" role="tab" type="button" aria-selected="${i===tab}" data-i="${i}">${x.n}</button>`).join("");
  $("code").textContent=c[tab].t;
}
const FILES={robots:"",llms:"",sitemap:"",json:[],names:[]};
let RAW=[];
const LB={robots:"robots.txt",llms:"llms.txt",sitemap:"sitemap.xml",json:"JSON-LD",html:"HTML de la página",otro:"tipo no reconocido"};
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function kind(n,t){n=n.toLowerCase();if(/robots/.test(n)||(/^\s*user-agent:/im.test(t)&&!/<html/i.test(t)))return"robots";if(/llms/.test(n))return"llms";if(/sitemap/.test(n)||/<urlset|<sitemapindex/i.test(t))return"sitemap";if(/\.(json|jsonld)$/.test(n))return"json";if(/\.html?$/.test(n)||/<html|<!doctype/i.test(t))return"html";return"otro"}
function info(k,t){
 if(k==="robots"){const b=blocked(t);return (b.length?"Bloquea: "+b.join(", "):"No bloquea rastreadores de IA")+(/^\s*sitemap:/im.test(t)?"; declara sitemap":"; sin línea Sitemap")}
 if(k==="llms")return /^#\s/m.test(t)&&/\]\(https?:/.test(t)?"Formato válido":"Falta título con # y enlaces en Markdown";
 if(k==="sitemap")return ((t.match(/<loc>/gi)||[]).length)+" URLs encontradas";
 if(k==="json"){try{JSON.parse(t)}catch(e){return "JSON no válido"}const ty=[...new Set([...t.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map(m=>m[1]))];return ty.length?"Tipos: "+ty.join(", "):"Sin @type"}
 if(k==="html")return "Cargado en el análisis de la página";
 return "No se usa en el análisis";
}
function sync(){FILES.robots=FILES.llms=FILES.sitemap="";FILES.json=[];RAW.forEach(r=>{if(r.k==="robots")FILES.robots=r.t;else if(r.k==="llms")FILES.llms=r.t;else if(r.k==="sitemap")FILES.sitemap=r.t;else if(r.k==="json")FILES.json.push(r.t)});FILES.names=RAW;
 $("flist").innerHTML=RAW.map((r,i)=>`<li><span><b>${esc(r.n)}</b> <span class="tag">${LB[r.k]}</span><br><small>${r.i}</small></span><button type="button" data-i="${i}" aria-label="Quitar ${esc(r.n)}">Quitar</button></li>`).join("")}
async function load(list){for(const f of list){if(f.size>5e6)continue;let t="";try{t=await f.text()}catch(e){continue}const k=kind(f.name,t);if(k==="html")$("html").value=t;RAW=RAW.filter(r=>r.n!==f.name);RAW.push({n:f.name,k,t,i:info(k,t)})}sync();if(!$("res").hidden&&$("url").value.trim())$("f").requestSubmit()}
$("files").addEventListener("change",e=>{load([...e.target.files]);e.target.value=""});
const dz=$("drop");["dragover","dragenter"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add("over")}));["dragleave","drop"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove("over")}));
dz.addEventListener("drop",e=>load([...e.dataTransfer.files]));
$("flist").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const i=+b.dataset.i;if(RAW[i].k==="html")$("html").value="";RAW=RAW.filter((_,j)=>j!==i);sync()});
$("f").addEventListener("submit",e=>{
  e.preventDefault();$("err").textContent="";
  try{ctx=parse()}catch(x){$("err").textContent=x.message;return}
  st={};auto={};let det=0;
  ITEMS.forEach(i=>{const v=i.a?i.a(ctx):undefined;auto[i.id]=v!==undefined;if(v!==undefined)det++;st[i.id]=v===true});
  $("mode").textContent=ctx.d?`Analicé el HTML que pegaste: ${det} de ${ITEMS.length} comprobaciones se detectaron solas. Marca a mano el resto (tráfico, enlaces, robots.txt, etc.).`:`Sin HTML solo puedo revisar la URL. Marca lo que ya cumples y obtendrás tu prioridad. Para un análisis real de tu página, pega su HTML arriba.`;
  if(FILES.names.length)$("mode").textContent+=" Archivos subidos: "+FILES.names.length+".";tab=0;build();paint();showCode();$("res").hidden=false;$("res").scrollIntoView({behavior:"smooth"});
});
$("list").addEventListener("change",e=>{const id=e.target.dataset.id;if(id){st[id]=e.target.checked;paint()}});
$("tabs").addEventListener("click",e=>{const b=e.target.closest("button");if(b){tab=+b.dataset.i;showCode()}});
$("copy").addEventListener("click",async()=>{
  const b=$("copy"),t=$("code").textContent;
  try{await navigator.clipboard.writeText(t);b.textContent="Copiado"}
  catch(e){const r=document.createRange();r.selectNodeContents($("code"));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent="Selecciona y copia"}
  setTimeout(()=>b.textContent="Copiar",1800);
});
