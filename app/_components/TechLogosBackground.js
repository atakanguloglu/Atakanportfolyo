"use client";

const logos = [
  { name: "React", Icon: ReactLogo, size: 72 },
  { name: "Next.js", Icon: NextLogo, size: 68 },
  { name: "GitHub", Icon: GitHubLogo, size: 68 },
  { name: "Node", Icon: NodeLogo, size: 60 },
  { name: "Tailwind", Icon: TailwindLogo, size: 68 },
  { name: "VS Code", Icon: VSCodeLogo, size: 60 },
  { name: "JavaScript", Icon: JSLogo, size: 64 },
  { name: "Python", Icon: PythonLogo, size: 64 },
  { name: "Angular", Icon: AngularLogo, size: 64 },
  { name: ".NET", Icon: DotNetLogo, size: 60 },
];

const positions = [
  { top: "8%", left: "5%" },
  { top: "15%", right: "8%" },
  { top: "45%", left: "3%" },
  { top: "70%", right: "5%" },
  { top: "25%", right: "12%" },
  { top: "55%", left: "10%" },
  { top: "80%", left: "15%" },
  { top: "10%", right: "25%" },
  { top: "35%", right: "3%" },
  { top: "60%", right: "18%" },
  { top: "5%", left: "25%" },
  { top: "85%", right: "12%" },
  { top: "20%", left: "12%" },
  { top: "40%", right: "8%" },
  { top: "75%", left: "8%" },
  { top: "12%", right: "15%" },
  { top: "50%", left: "6%" },
  { top: "90%", right: "20%" },
];

function ReactLogo({ className, size = 48 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" fill="#1e3a5f"/>
      <path d="M12 21.35c-1.5-1.1-6.5-4.4-6.5-9.35 0-4.1 2.9-6.85 6.5-6.85s6.5 2.75 6.5 6.85c0 4.95-5 8.25-6.5 9.35Z" stroke="#1e3a5f" strokeWidth="1.2" fill="none" opacity="0.9"/>
      <path d="M12 2.65c1.5 1.1 6.5 4.4 6.5 9.35 0 4.1-2.9 6.85-6.5 6.85S5.5 15.1 5.5 11c0-4.95 5-8.25 6.5-9.35Z" stroke="#1e3a5f" strokeWidth="1.2" fill="none" opacity="0.9"/>
      <ellipse cx="12" cy="12" rx="2.5" ry="6" stroke="#1e3a5f" strokeWidth="1.2" fill="none" opacity="0.8"/>
    </svg>
  );
}

function NextLogo({ className, size = 44 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.5 4h-1v7.2l5.2-7.2h1.3l-5.5 7.5 5.8 8h-1.3l-5.2-7.2V4z" fill="#0f172a"/>
      <path d="M18.5 4h-1v16h1V4z" fill="#0f172a"/>
    </svg>
  );
}

function GitHubLogo({ className, size = 44 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" fill="#0f172a"/>
    </svg>
  );
}

function NodeLogo({ className, size = 40 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6 3.3v6.9l-6 3.3-6-3.3V7.5l6-3.3z" fill="#339933"/>
      <path d="M12 10.2L6 13v4.5l6 3.3 6-3.3V13l-6-2.8z" fill="#333" opacity="0.9"/>
    </svg>
  );
}

function TailwindLogo({ className, size = 44 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 6.5c-1.2 0-2.2.5-2.9 1.4-.7.9-1.2 2.1-1.5 3.5.9-1.2 2-1.8 3.2-1.8 1.2 0 2.2.5 2.9 1.4.7.9 1.2 2.1 1.5 3.5-.9 1.2-2 1.8-3.2 1.8-1.2 0-2.2-.5-2.9-1.4C9.2 12.2 8.7 11 8.4 9.6c-.9 1.2-2 1.8-3.2 1.8-1.2 0-2.2-.5-2.9-1.4C1.6 9.1 1.1 7.9.8 6.5H6c.2.8.5 1.5.9 2 .4.5 1 .8 1.5.8 1.2 0 2.2-.5 2.9-1.4.7-.9 1.2-2.1 1.5-3.5-.9 1.2-2 1.8-3.2 1.8-1.2 0-2.2.5-2.9 1.4-.7.9-1.2 2.1-1.5 3.5.9-1.2 2-1.8 3.2-1.8 1.2 0 2.2.5 2.9 1.4.7.9 1.2 2.1 1.5 3.5h5.2c-.3-1.4-.8-2.6-1.5-3.5-.7-.9-1.7-1.4-2.9-1.4z" fill="#06B6D4"/>
    </svg>
  );
}

function VSCodeLogo({ className, size = 40 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 6.5v11L15 21V3l7 3.5z" fill="#007ACC"/>
      <path d="M15 3L3 8.5v7L15 21V3z" fill="#1f8ad0"/>
      <path d="M3 8.5l5 2.5-5 2.5V8.5zm0 7l5-2.5-5-2.5v5z" fill="#55a5d9" opacity="0.8"/>
    </svg>
  );
}

function JSLogo({ className, size = 48 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="2" fill="#F7DF1E"/>
      <path d="M7.5 17.5v-8c0-.8.3-1.5.9-2 .6-.5 1.3-.7 2.1-.7.8 0 1.5.2 2.1.7.6.5.9 1.2.9 2v1.8h-1.8v-1.3c0-.3-.1-.5-.3-.7-.2-.2-.5-.3-.9-.3s-.7.1-.9.3c-.2.2-.3.4-.3.7v7.3H7.5zm8.2-3.2c0 .5-.2.9-.5 1.2-.3.3-.8.5-1.3.5-.6 0-1-.2-1.3-.5-.3-.3-.5-.7-.5-1.2v-1.2h1.8v1.2c0 .2 0 .3.1.4.1.1.3.2.6.2.3 0 .5-.1.6-.2.1-.1.1-.2.1-.4v-4.8h1.8v4.8z" fill="#323330"/>
    </svg>
  );
}

function PythonLogo({ className, size = 48 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.2 2.5H9.8C7.2 2.5 5 4.7 5 7.3v2.2h5.5V8.8h8.2V7.3c0-2.6-2.2-4.8-4.8-4.8z" fill="#3776AB"/>
      <path d="M9.8 21.5h4.4c2.6 0 4.8-2.2 4.8-4.8v-2.2H14v1.7H5.8v1.5c0 2.6 2.2 4.8 4.8 4.8z" fill="#3776AB"/>
      <path d="M5 9.5v5c0 2.6 2.2 4.8 4.8 4.8h1.2V17H5v-7.5zm9.2 5v2.2c0 2.6-2.2 4.8-4.8 4.8H8.2V19h6V14.5zm-4.7-4.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm7.5 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z" fill="#FFD43B"/>
    </svg>
  );
}

function AngularLogo({ className, size = 48 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.5L3 7v10l9 4.5 9-4.5V7l-9-4.5zM12 5.2l5.5 2.8v5.5L12 16.2l-5.5-2.7V8L12 5.2z" fill="#DD0031"/>
      <path d="M12 7.5l-3 6h2l.5-1h2.8l.5 1h2l-3-6h-2zM12 10l1 2h-2l1-2z" fill="#fff"/>
    </svg>
  );
}

function DotNetLogo({ className, size = 48 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 4v16l6.5 3.5 6.5-3.5V4L12 .5 5.5 4zm0 2.2L12 4.2l6.5 2v11.6l-6.5 3.5-6.5-3.5V6.2z" fill="#512BD4"/>
      <path d="M12 8.5l-2.5 3.5h1.5v3h2v-3h1.5L12 8.5z" fill="#fff"/>
    </svg>
  );
}

export default function TechLogosBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {positions.map((pos, idx) => {
        const logo = logos[idx % logos.length];
        const delay = (idx * 0.8) % 5;
        const duration = 14 + (idx % 4) * 3;
        const Icon = logo.Icon;
        return (
          <div
            key={`tech-${idx}`}
            className="absolute tech-float"
            style={{
              ...pos,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            <Icon className="shrink-0" size={logo.size} />
          </div>
        );
      })}
    </div>
  );
}
