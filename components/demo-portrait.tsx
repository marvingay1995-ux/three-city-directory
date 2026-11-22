/** Original, non-photographic artwork for fictional directory listings. */
export function DemoPortrait({ variant }: { variant: string }) {
  const palettes: Record<string, [string, string, string]> = {
    d1: ["#9e666d", "#edbd9d", "#4d2b42"],
    d2: ["#8a7a80", "#e4bda7", "#303c51"],
    m1: ["#7b8e86", "#d7ad94", "#304b4b"],
    m2: ["#ae8468", "#f0c6a7", "#50433b"],
    q1: ["#8c7b9b", "#dfb69e", "#38334f"],
    q2: ["#778d9c", "#e4c1a7", "#334450"]
  };
  const [back, skin, shadow] = palettes[variant] ?? palettes.d1;
  const id = "portrait-" + variant;
  return <svg className="demo-portrait" viewBox="0 0 300 400" role="img" aria-label="Original illustration of a fictional editorial portrait" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={id + "-bg"} x1="0" y1="0" x2="1" y2="1"><stop stopColor={back}/><stop offset="1" stopColor={shadow}/></linearGradient>
      <linearGradient id={id + "-face"} x1="0" y1="0" x2=".8" y2="1"><stop stopColor={skin}/><stop offset="1" stopColor="#a9756b"/></linearGradient>
    </defs>
    <rect width="300" height="400" fill={"url(#" + id + "-bg)"}/>
    <circle cx="232" cy="73" r="90" fill="#ffffff" opacity=".06"/>
    <path d="M0 345 Q55 305 96 312 Q150 332 204 307 Q255 294 300 332 V400 H0Z" fill="#fff" opacity=".06"/>
    <path d="M37 400 Q43 314 103 293 Q132 283 132 254 H169 Q170 282 197 293 Q263 308 269 400Z" fill={shadow}/>
    <path d="M120 258 Q126 286 104 298 Q150 332 195 298 Q171 285 177 258Z" fill={skin}/>
    <path d="M87 157 Q85 96 153 89 Q219 92 217 164 L211 223 Q194 276 151 282 Q105 270 91 223Z" fill={"url(#" + id + "-face)"}/>
    <path d="M86 174 Q70 105 107 76 Q150 42 194 79 Q228 99 221 174 L211 205 Q207 149 192 124 Q152 139 110 116 Q95 139 93 205Z" fill={shadow}/>
    <path d="M112 188 Q125 181 138 188 M166 188 Q178 181 191 188" fill="none" stroke={shadow} strokeWidth="3" strokeLinecap="round"/>
    <path d="M150 194 L144 223 Q151 227 157 222" fill="none" stroke="#a06c67" strokeWidth="2" strokeLinecap="round"/>
    <path d="M133 242 Q150 250 168 241" fill="none" stroke="#8e5558" strokeWidth="3" strokeLinecap="round"/>
    <path d="M82 166 Q72 242 103 284 L82 309 Q48 234 68 148Z M216 165 Q233 247 198 285 L220 311 Q251 239 235 147Z" fill={shadow}/>
    <path d="M0 370 Q75 330 122 345 Q150 360 178 345 Q230 326 300 370" fill="none" stroke="#fff" strokeWidth="1" opacity=".17"/>
  </svg>;
}
