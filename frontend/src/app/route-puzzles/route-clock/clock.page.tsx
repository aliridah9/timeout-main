import { useEffect, useState } from "react";
import { ClockCard } from "~/app/route-puzzles/route-clock/clock-card";
import { useCountRendered } from "~/app/route-puzzles/route-clock/use-count-rendered";

export default function ClockPage() {
  const uniqueKey = Date.now();
  return (
    <div className="flex justify-center sm:flex-col lg:flex-row">
      <div className="m-10" data-testid="detailed-clock">
        <DetailedClock key={uniqueKey} />
      </div>
      <div className="m-10" data-testid="regular-clock">
        <RegularClock key={uniqueKey} />
      </div>
    </div>
  );
}

function DetailedClock() {
  const { hours, minutes, seconds } = useCurrentTime("second");
  const countRendered = useCountRendered();
  return (
    <ClockCard title={`Number of renders: ${countRendered}`}>
      <Clock hours={hours} minutes={minutes} seconds={seconds} />
    </ClockCard>
  );
}

function RegularClock() {
  const { hours, minutes } = useCurrentTime("minute");
  const countRendered = useCountRendered();
  return (
    <ClockCard title={`Number of renders: ${countRendered}`}>
      <Clock hours={hours} minutes={minutes} />
    </ClockCard>
  );
}

function Clock({ hours, minutes, seconds }: { hours: number; minutes: number; seconds?: number }) {
  return (
    <div
      className="relative h-[328px] w-[328px] rounded-[50%] border-[14px] border-solid border-black bg-slate-100 shadow-md"
      style={{
        boxShadow: "0 2vw 4vw -1vw rgba(0,0,0,0.8)",
        transform: "scale(0.8)",
      }}
    >
      {/* Middle Dot */}
      <div
        className="absolute inset-0 z-50 m-auto h-3.5 w-3.5 rounded-[50%] bg-slate-400"
        style={{ boxShadow: "0 2px 4px -1px black" }}
      ></div>
      <div>
        {/* Hour hand */}
        <div
          className="absolute left-[50%] top-[79px] z-0 ml-[-2px] h-[65px] w-1 bg-black"
          style={{
            borderTopLeftRadius: "50%",
            borderTopRightRadius: "50%",
            transformOrigin: "50% 72px",
            transform: `rotate(${hours * 30 + minutes * (360 / 720)}deg)`,
          }}
        ></div>
        {/* Minute hand */}
        <div
          className="absolute left-[50%] top-[46px] z-10 ml-[-2px] h-[100px] w-1 bg-black"
          style={{
            borderTopLeftRadius: "50%",
            borderTopRightRadius: "50%",
            transformOrigin: "50% 105px",
            transform: `rotate(${minutes * 6 + (seconds ?? 0) * (360 / 3600)}deg)`,
          }}
        ></div>
        {/* Second hand */}
        {seconds != null && (
          <div
            className="absolute left-[50%] top-6 z-20 ml-[-1px] h-32 w-0.5 bg-yellow-300"
            style={{
              borderTopLeftRadius: "50%",
              borderTopRightRadius: "50%",
              transformOrigin: "50% 125px",
              transform: `rotate(${seconds * 6}deg)`,
            }}
          ></div>
        )}
      </div>
      <div>
        <span className="absolute right-7 top-36 z-0 inline-block text-xl font-bold text-black">3</span>
        <span className="absolute bottom-7 left-[50%] z-0 ml-[-5px] inline-block text-xl font-bold text-black">6</span>
        <span className="absolute left-8 top-36 z-0 inline-block text-xl font-bold text-black">9</span>
        <span className="absolute left-[50%] top-7 z-0 ml-[-9px] inline-block text-xl font-bold text-black">12</span>
      </div>
      {[...Array(60)].map((_, i) => {
        const angle = i * 6;
        const classNames = i % 5 === 0 ? "w-1 h-6" : "w-0.5 h-4";
        return (
          <div
            key={i}
            className={`absolute left-[50%] z-0 ml-[-1px] bg-slate-700 ${classNames}`}
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: "50% 150px",
            }}
          ></div>
        );
      })}
    </div>
  );
}

function useCurrentTime(updateInterval: "second" | "minute") {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: updateInterval === "second" ? now.getSeconds() : undefined,
    };
  });

  useEffect(() => {
    const interval = setInterval(
      () => {
        const now = new Date();
        setTime({
          hours: now.getHours(),
          minutes: now.getMinutes(),
          seconds: updateInterval === "second" ? now.getSeconds() : undefined,
        });
      },
      updateInterval === "second" ? 1000 : 60000
    ); // Update every second or minute

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [updateInterval]);

  return time;
}
