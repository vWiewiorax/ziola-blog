export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M39.5 8.5C25.5 8.8 13.6 14.2 9.1 24.1c-3.4 7.5-.1 13.4 5.2 14.8 8.1 2.2 15.8-4.2 19.7-11.3 3.2-5.7 4.8-12.4 5.5-19.1Z"
        fill="currentColor"
      />
      <path
        d="M10.7 37.6c7.2-7.7 13.9-14.1 25.1-22.7"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}
