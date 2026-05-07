let chart = null;
let out = "";

// ======================
// UTIL
// ======================

function setExample(v){
  document.getElementById("input").value = v;
}

function clearChart(){
  if(chart){
    chart.destroy();
    chart = null;
  }
}

// ======================
// DETECTOR GLOBAL
// ======================

function detectMode(text){

  let t = text.toLowerCase();

  // física
  if(t.includes("f =") || t.includes("v =") || t.includes("a =") || t.includes("e = m")){
    return "physics";
  }

  // química
  if(t.includes("mol") || t.includes("h2") || t.includes("o2") || t.includes("h2o")){
    return "chemistry";
  }

  // matemática sistema
  if(t.includes(",") && t.includes("=")) return "system";

  if(t.includes("x^2")) return "quadratic";
  if(t.includes("=")) return "linear";

  return "function";
}

// ======================
// PARSER MATEMÁTICO
// ======================

function parseMath(t){

  t = t.toLowerCase();

  t = t.replaceAll("seno de x","sin(x)");
  t = t.replaceAll("coseno de x","cos(x)");
  t = t.replaceAll("tangente de x","tan(x)");

  t = t.replaceAll("al cuadrado","^2");
  t = t.replaceAll("al cubo","^3");

  t = t.replaceAll("más","+");
  t = t.replaceAll("menos","-");
  t = t.replaceAll("por","*");
  t = t.replaceAll("dividido","/");

  t = t.replace(/(\d)(x)/g,"$1*$2");
  t = t.replaceAll("^","**");

  t = t.replaceAll("sin(x)","Math.sin(x)");
  t = t.replaceAll("cos(x)","Math.cos(x)");
  t = t.replaceAll("tan(x)","Math.tan(x)");

  t = t.replaceAll("pi","Math.PI");

  return t.replace(/\s+/g,"");
}

// ======================
// DERIVADAS
// ======================

function derivative(expr){

  if(expr === "x") return "1";

  let m = expr.match(/^(\d+)\*x\*\*(\d+)$/);
  if(m){
    let a = +m[1], n = +m[2];
    return `${a*n}*x**${n-1}`;
  }

  m = expr.match(/^x\*\*(\d+)$/);
  if(m){
    let n = +m[1];
    return `${n}*x**${n-1}`;
  }

  if(expr === "Math.sin(x)") return "Math.cos(x)";
  if(expr === "Math.cos(x)") return "-Math.sin(x)";

  return "No soportado aún";
}

// ======================
// INTEGRALES
// ======================

function integral(expr){

  let m = expr.match(/^(\d+)\*x\*\*(\d+)$/);
  if(m){
    let a = +m[1], n = +m[2] + 1;
    return `${a}*x**${n}/${n}`;
  }

  m = expr.match(/^x\*\*(\d+)$/);
  if(m){
    let n = +m[1] + 1;
    return `x**${n}/${n}`;
  }

  if(expr === "Math.sin(x)") return "-Math.cos(x)";
  if(expr === "Math.cos(x)") return "Math.sin(x)";

  return "No soportado aún";
}

// ======================
// FÍSICA
// ======================

function physicsSolver(input){

  let t = input.toLowerCase();

  // F = m * a
  if(t.includes("f") && t.includes("m") && t.includes("a")){
    return "F = m * a (Fuerza en Newtons)";
  }

  // E = m c^2
  if(t.includes("e") && t.includes("c^2")){
    return "E = m * c^2 (Energía de Einstein)";
  }

  // v = d / t
  if(t.includes("v") && t.includes("d") && t.includes("t")){
    return "v = d / t (Velocidad)";
  }

  return "Ecuación física no reconocida";
}

// ======================
// QUÍMICA
// ======================

function chemistrySolver(input){

  let t = input.toLowerCase();

  if(t.includes("h2") && t.includes("o2") && t.includes("h2o")){
    return "2H2 + O2 → 2H2O (Reacción de formación de agua)";
  }

  if(t.includes("mol")){
    return "mol = masa / masa_molar";
  }

  return "Reacción química no reconocida";
}

// ======================
// GRÁFICO
// ======================

function draw(expr){

  clearChart();

  expr = expr.replaceAll("^","**");

  let labels = [];
  let data = [];

  for(let x=-10;x<=10;x+=0.1){

    try{
      let y = Function("x","return "+expr)(x);

      if(!isFinite(y)) y = null;

      data.push(y);
      labels.push(x);
    }catch{
      data.push(null);
      labels.push(x);
    }
  }

  chart = new Chart(document.getElementById("chart"),{
    type:"line",
    data:{
      labels,
      datasets:[{data,label:"f(x)",pointRadius:0}]
    },
    options:{responsive:true}
  });
}

// ======================
// MAIN
// ======================

function run(){

  let raw = document.getElementById("input").value;
  let expr = parseMath(raw);
  let mode = detectMode(raw);

  let result = "";

  // ======================
  // FÍSICA
  // ======================

  if(mode === "physics"){
    clearChart();
    result = physicsSolver(raw);
  }

  // ======================
  // QUÍMICA
  // ======================

  else if(mode === "chemistry"){
    clearChart();
    result = chemistrySolver(raw);
  }

  // ======================
  // DERIVADAS
  // ======================

  else if(raw.toLowerCase().startsWith("derivar ")){

    let e = parseMath(raw.slice(9));
    result = derivative(e);

    clearChart();
  }

  // ======================
  // INTEGRALES
  // ======================

  else if(raw.toLowerCase().startsWith("integral ")){

    let e = parseMath(raw.slice(10));
    result = integral(e);

    clearChart();
  }

  // ======================
  // SISTEMA
  // ======================

  else if(mode === "system"){

    let [e1,e2] = expr.split(",");

    let a = +e1.split("=")[1];
    let b = +e2.split("=")[1];

    result = `x=${(a+b)/2}, y=${(a-b)/2}`;
  }

  // ======================
  // LINEAL
  // ======================

  else if(mode === "linear"){

    let r = +expr.split("=")[1];
    let m = expr.split("=")[0].match(/(-?\d*)x([+-]\d+)?/);

    let a = m && m[1] ? +m[1] : 1;
    let b = m && m[2] ? +m[2] : 0;

    result = "x=" + (r-b)/a;
  }

  // ======================
  // CUADRÁTICA
  // ======================

  else if(mode === "quadratic"){

    let [l] = expr.split("=");
    l = l.replace(/-/g,"+-");

    let a=0,b=0,c=0;

    for(let p of l.split("+")){
      if(p.includes("x^2")) a+=+p.replace("x^2","");
      else if(p.includes("x")) b+=+p.replace("x","");
      else if(p) c+=+p;
    }

    let d = b*b - 4*a*c;

    result = [
      (-b+Math.sqrt(d))/(2*a),
      (-b-Math.sqrt(d))/(2*a)
    ].join(",");
  }

  // ======================
  // FUNCIÓN
  // ======================

  else{
    draw(expr);
    result = "Función graficada";
  }

  document.getElementById("result").innerHTML = result;
}
