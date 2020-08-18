(this["webpackJsonpweb-audio-api-v2-issue-7"]=this["webpackJsonpweb-audio-api-v2-issue-7"]||[]).push([[0],[,,,,function(e,t,a){e.exports={svg:"analyser-chart_svg__2S828",path:"analyser-chart_path__34OOx"}},function(e,t,a){e.exports={pre:"demo-2_pre__2_gw9",code:"demo-2_code__3ESEA"}},,function(e,t,a){e.exports={Loading:"demo-1_Loading__JbyOo"}},function(e){e.exports=JSON.parse('{"a":"web-audio-api-v2-issue-7"}')},,,,function(e,t,a){e.exports={Col:"col_Col__1zaJG"}},,function(e,t,a){e.exports={Row:"row_Row__2P6i2"}},function(e,t,a){e.exports={App:"app_App__3ALCk"}},,function(e,t,a){e.exports=a(26)},,,,,,,,function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(11),l=a.n(c),u=a(1),o=a(2),s=a(12),i=function(e){var t=e.children,a=Object(o.a)(e,["children"]);return r.a.createElement("div",Object.assign({},a,{className:s.Col}),t)},m=a(13),f=a.n(m),d=a(14),p=function(e){var t=e.children,a=Object(o.a)(e,["children"]);return r.a.createElement("div",Object.assign({},a,{className:d.Row}),t)},E=a(15),g=a(8),b=a(3),y=a.n(b),v=a(9),h=a(6),O=a(16),T=a(4),w=function(e){var t=e.analyser,a=e.chartType,c=Object(n.useState)(),l=Object(u.a)(c,2),o=l[0],s=l[1],i=Object(n.useState)(""),m=Object(u.a)(i,2),f=m[0],d=m[1],p=r.a.useRef(),E=function e(){var n,r,c;if(t&&("waveform"===a?(n=new Float32Array(t.fftSize),t.getFloatTimeDomainData(n),r=-1,c=1):"fft"===a&&(n=new Float32Array(t.frequencyBinCount),t.getFloatFrequencyData(n),r=-120,c=0),n)){var l=n.reduce((function(e,t,a){var n=t;return n<r?n=r:n>c?n=c:Number.isFinite(n)||(n=0),"".concat(e," M").concat(a,",0 L").concat(a,",").concat(n)}),"");d(l)}p.current=requestAnimationFrame(e)};return Object(n.useLayoutEffect)((function(){return p.current=requestAnimationFrame(E),function(){return cancelAnimationFrame(p.current)}}),[]),Object(n.useEffect)((function(){t&&("waveform"===a?s("0 ".concat(-1," ").concat(t.fftSize," ").concat(2)):"fft"===a&&s("0 ".concat(-120," ").concat(t.frequencyBinCount," ").concat(120)))}),[t,a]),r.a.createElement("svg",{preserveAspectRatio:"none",className:T.svg,viewBox:o},r.a.createElement("path",{d:f,className:T.path}))},j=function(e){var t=e.playType,a=e.choices,n=e.setPlayType;return r.a.createElement("div",null,"audio output:",r.a.createElement("br",null),a.map((function(e){return r.a.createElement("button",{key:e,disabled:e===t,onClick:function(){return n(e)}},e)})))},A=function(e){for(var t=e.numCycles,a=e.pulseWidth,n="",c=100*t,l=0;l<t;l++)for(var u=0;u<100;u++){var o=u/100<a?-1:1,s=100*l+u;n+="M".concat(s,",0 L").concat(s,",").concat(o)}return r.a.createElement("svg",{className:T.svg,preserveAspectRatio:"none",viewBox:"0 -1 ".concat(c," 2")},r.a.createElement("path",{stroke:"black",d:n}))},k=function(e){var t=e.presets,a=e.setter,n=Object(o.a)(e,["presets","setter"]);return r.a.createElement("div",null,n.name,":\xa0",r.a.createElement("small",null,n.value),r.a.createElement("br",null),r.a.createElement("input",Object.assign({},n,{type:"range",onChange:function(e){return a(parseFloat(e.target.value))}})),r.a.createElement("br",null),(t||[]).map((function(e){return r.a.createElement("button",{key:e,disabled:n.value===e,onClick:function(){return a(e)},style:{marginBottom:10}},e)})))},N=a(7),S=Math.pow(2,12),C="stopped",_="worklet",x="custom",q="square",W=function(){var e=Object(n.useState)(440),t=Object(u.a)(e,2),a=t[0],c=t[1],l=Object(n.useState)(0),o=Object(u.a)(l,2),s=o[0],m=o[1],f=Object(n.useState)(.5),d=Object(u.a)(f,2),E=d[0],g=d[1],b=Object(n.useState)(0),T=Object(u.a)(b,2),W=T[0],V=T[1],F=Object(n.useState)(C),L=Object(u.a)(F,2),R=L[0],M=L[1],G=Object(n.useState)(!1),P=Object(u.a)(G,2),B=P[0],z=P[1],J=Object(n.useState)(),D=Object(u.a)(J,2),I=D[0],H=D[1],K=Object(n.useState)((function(){var e=new AudioContext,t=new GainNode(e,{gain:0}),a=new GainNode(e,{gain:0}),n=new GainNode(e,{gain:0}),r=new OscillatorNode(e,{detune:0,frequency:440,type:"square"}),c=new OscillatorNode(e,{detune:0,frequency:440}),l=new AnalyserNode(e,{smoothingTimeConstant:0}),u=new AnalyserNode(e,{smoothingTimeConstant:0});return t.connect(e.destination),r.connect(a),a.connect(t),r.connect(l),r.start(),c.connect(n),n.connect(t),c.connect(u),c.start(),{ac:e,gainMain:t,gainSquare:a,gainCustom:n,gainWorklet:void 0,oscSquare:r,oscCustom:c,oscWorklet:void 0,analyserSquare:l,analyserCustom:u,analyserWorklet:void 0}})),Q=Object(u.a)(K,2),U=Q[0],X=U.ac,Y=U.gainMain,Z=U.gainSquare,$=U.gainCustom,ee=U.gainWorklet,te=U.oscSquare,ae=U.oscCustom,ne=U.oscWorklet,re=U.analyserSquare,ce=U.analyserCustom,le=U.analyserWorklet,ue=Q[1],oe=function(){for(var e=S*E,t=[],a=0;a<S;a++)t[a]=a<e?-1:1;var n=new O.FFT(t.length);n.forward(t);var r=X.createPeriodicWave(new Float32Array(n.real),new Float32Array(n.imag),{disableNormalization:!1});ae.setPeriodicWave(r)};return Object(n.useEffect)((function(){ae.frequency.setValueAtTime(a,X.currentTime),te.frequency.setValueAtTime(a,X.currentTime),ne&&ne.parameters.get("frequency").setValueAtTime(a,X.currentTime)}),[a]),Object(n.useEffect)((function(){ae.detune.setValueAtTime(s,X.currentTime),te.detune.setValueAtTime(s,X.currentTime),ne&&ne.parameters.get("detune").setValueAtTime(s,X.currentTime)}),[s]),Object(n.useEffect)((function(){oe(),ne&&ne.parameters.get("pulseWidth").setValueAtTime(E,X.currentTime)}),[E]),Object(n.useEffect)((function(){Y.gain.value=W}),[W]),Object(n.useEffect)((function(){R!==C&&"suspended"===X.state&&X.resume(),R===C?X.suspend():R===_?($.gain.setValueAtTime(0,X.currentTime),Z.gain.setValueAtTime(0,X.currentTime),ee&&ee.gain.setValueAtTime(1,X.currentTime)):R===x?(oe(),$.gain.setValueAtTime(1,X.currentTime),Z.gain.setValueAtTime(0,X.currentTime),ee&&ee.gain.setValueAtTime(0,X.currentTime)):R===q&&($.gain.setValueAtTime(0,X.currentTime),Z.gain.setValueAtTime(1,X.currentTime),ee&&ee.gain.setValueAtTime(0,X.currentTime))}),[R]),Object(n.useEffect)((function(){return Object(h.a)(y.a.mark((function e(){var t,a,n;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,X.audioWorklet.addModule("pulse-oscillator.js");case 3:t=new AudioWorkletNode(X,"pulse-oscillator"),a=new AnalyserNode(X,{smoothingTimeConstant:0}),n=new GainNode(X,{gain:0}),t.connect(a),t.connect(n),n.connect(Y),ue((function(e){return Object(v.a)(Object(v.a)({},e),{},{oscWorklet:t,analyserWorklet:a,gainWorklet:n})})),z(!0),e.next=17;break;case 13:e.prev=13,e.t0=e.catch(0),console.error(e.t0),H(e.t0.message);case 17:case"end":return e.stop()}}),e,null,[[0,13]])})))(),function(){X.close()}}),[]),I?r.a.createElement("div",{className:N.Loading},"an error occured while loading the worklet: ",I):B?r.a.createElement(p,null,r.a.createElement(i,null,r.a.createElement("h2",null,"App Settings"),r.a.createElement(k,{name:"gain",value:W,min:0,max:1,step:.001,setter:V,presets:[0,.3,.5,.8,1]}),r.a.createElement(j,{playType:R,choices:[C,_,x,q],setPlayType:M}),r.a.createElement("h2",null,"Pulse Oscillator Settings"),r.a.createElement(k,{name:"frequency",value:a,min:-2e3,max:2e3,step:1,setter:c,presets:[-2e3,-880,-440,-220,-110,-55,0,55,110,220,440,880,2e3]}),r.a.createElement(k,{name:"detune",value:s,min:-2400,max:2400,step:1,setter:m,presets:[-2400,-1200,-600,0,600,1200,2400]}),r.a.createElement(k,{name:"pulseWidth",value:E,min:0,max:1,step:.001,setter:g,presets:[0,.01,.25,.5,.75,.99,1]}),r.a.createElement("br",null),r.a.createElement(A,{pulseWidth:E,numCycles:5})),r.a.createElement(i,{className:N.Col},r.a.createElement("h2",null,"Visualizations"),r.a.createElement("h3",null,"worklet"),r.a.createElement(p,null,r.a.createElement(i,null,r.a.createElement(w,{analyser:le,chartType:"waveform"})),r.a.createElement(i,null,r.a.createElement(w,{analyser:le,chartType:"fft"}))),r.a.createElement("h3",null,"custom"),r.a.createElement(p,null,r.a.createElement(i,null,r.a.createElement(w,{analyser:ce,chartType:"waveform"})),r.a.createElement(i,null,r.a.createElement(w,{analyser:ce,chartType:"fft"}))),r.a.createElement("h3",null,"square"),r.a.createElement(p,null,r.a.createElement(i,null,r.a.createElement(w,{analyser:re,chartType:"waveform"})),r.a.createElement(i,null,r.a.createElement(w,{analyser:re,chartType:"fft"}))))):r.a.createElement("div",{className:N.Loading},"loading worklet...")},V=a(5),F=function(){var e=Object(n.useRef)(),t=Object(n.useRef)(),a=Object(n.useRef)(),c=Object(n.useRef)(),l=Object(n.useState)(!1),o=Object(u.a)(l,2),s=o[0],m=o[1],f=Object(n.useState)(),d=Object(u.a)(f,2),E=d[0],g=d[1],b=Object(n.useState)(0),v=Object(u.a)(b,2),O=v[0],T=v[1];return Object(n.useEffect)((function(){c.current&&e.current&&c.current.gain.setValueAtTime(O,e.current.currentTime)}),[O]),Object(n.useEffect)((function(){var n=new AudioContext;return Object(h.a)(y.a.mark((function e(){var r,l,u,o;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,n.audioWorklet.addModule("pulse-oscillator.js");case 3:t.current=new AnalyserNode(n,{smoothingTimeConstant:0}),a.current=new AnalyserNode(n,{smoothingTimeConstant:0}),c.current=new GainNode(n,{gain:0}),r=new OscillatorNode(n,{frequency:.5}),l=new ConstantSourceNode(n),u=new GainNode(n,{gain:.5}),(o=new AudioWorkletNode(n,"pulse-oscillator")).parameters.get("frequency").setValueAtTime(200,n.currentTime),r.connect(u),l.connect(u),o.connect(t.current),o.connect(c.current),c.current.connect(n.destination),r.start(),l.start(),u.connect(o.parameters.get("pulseWidth")),u.connect(a.current),m(!0),e.next=27;break;case 23:e.prev=23,e.t0=e.catch(0),console.error(e.t0),g(e.t0.message);case 27:case"end":return e.stop()}}),e,null,[[0,23]])})))(),e.current=n,function(){e.current.close()}}),[]),E?r.a.createElement("div",{className:V.Loading},"an error occured while loading the worklet: ",E):s?r.a.createElement(r.a.Fragment,null,r.a.createElement(p,null,r.a.createElement(i,null,"The goal if this demo is to emulate the following SuperCollider code using the webaudio api",r.a.createElement("pre",{className:V.pre},r.a.createElement("code",{className:V.code},"{ Pulse.ar(200, SinOsc.ar(0.5).range(0, 1)) }.play")))),r.a.createElement(p,null,r.a.createElement(i,null,r.a.createElement(k,{name:"gain",value:O,min:0,max:1,step:.001,setter:T,presets:[0,.3,.5,.8,1]}))),r.a.createElement("h2",null,"output of our pulse oscillator after connecting lfo"),r.a.createElement(p,null,r.a.createElement(i,null,r.a.createElement(w,{analyser:t.current,chartType:"waveform"})),r.a.createElement(i,null,r.a.createElement(w,{analyser:t.current,chartType:"fft"}))),r.a.createElement("h2",null,"lfo output (current pulseWidth value)"),r.a.createElement(p,null,r.a.createElement(i,null,r.a.createElement(w,{analyser:a.current,chartType:"waveform"})),r.a.createElement(i,null,r.a.createElement(w,{analyser:a.current,chartType:"fft"}))),r.a.createElement(p,null,r.a.createElement(i,{style:{margin:20,padding:20}},"The demo is currently incomplete/unfinished"))):r.a.createElement("div",{className:V.Loading},"loading worklet...")},L=function(){var e,t=Object(n.useState)("demo1"),a=Object(u.a)(t,2),c=a[0],l=a[1];return"demo1"===c?e=r.a.createElement(W,null):"demo2"===c&&(e=r.a.createElement(F,null)),r.a.createElement("div",{className:E.App},r.a.createElement(p,null,r.a.createElement(i,null,r.a.createElement("h1",null,g.a)),r.a.createElement(i,{style:{alignSelf:"center"}},["demo1","demo2"].map((function(e){return r.a.createElement("button",{key:e,disabled:c===e,onClick:function(){return l(e)}},e)})))),r.a.createElement(p,null,r.a.createElement(i,null,e)),r.a.createElement(f.a,{href:"https://github.com/skratchdot/".concat(g.a)}))};a(25);l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(L,null)),document.getElementById("root"))}],[[17,1,2]]]);
//# sourceMappingURL=main.1f70c59a.chunk.js.map