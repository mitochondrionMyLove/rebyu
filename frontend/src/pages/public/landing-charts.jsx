import { useId, useLayoutEffect, useRef } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    PolarAngleAxis,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const readinessData = [
    { stage: "Diagnostic", score: 38 },
    { stage: "Quiz 1", score: 46 },
    { stage: "Quiz 2", score: 55 },
    { stage: "Middle", score: 64 },
    { stage: "Mock 1", score: 73 },
    { stage: "Current", score: 82 },
];

const topicMasteryData = [
    { topic: "Software Dev", mastery: 78 },
    { topic: "Databases", mastery: 71 },
    { topic: "Info Systems", mastery: 66 },
    { topic: "Networking", mastery: 54 },
];

const studyConsistencyData = [
    { day: "Mon", minutes: 24 },
    { day: "Tue", minutes: 38 },
    { day: "Wed", minutes: 31 },
    { day: "Thu", minutes: 46 },
    { day: "Fri", minutes: 42 },
    { day: "Sat", minutes: 58 },
    { day: "Sun", minutes: 51 },
];

const assessmentData = [
    { assessment: "Diagnostic", score: 42 },
    { assessment: "Lesson quiz", score: 68 },
    { assessment: "Middle exam", score: 74 },
    { assessment: "Mock exam", score: 81 },
];

function ChartTooltip({ active, payload, label, suffix = "%" }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border border-[#DCE4EF] bg-white px-3 py-2 shadow-[0_10px_26px_rgba(11,31,58,0.12)]">
            <p className="text-[11px] font-semibold text-[#66758A]">{label}</p>
            <p className="mt-0.5 text-sm font-bold text-[#273452]">
                {payload[0].value}
                {suffix}
            </p>
        </div>
    );
}

function useChartEntrance(type, dependencies = []) {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const root = containerRef.current;
        if (!root) return undefined;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        let frameId;
        const ctx = gsap.context(() => {
            frameId = window.requestAnimationFrame(() => {
                if (reducedMotion) return;

                const axes = root.querySelectorAll(
                    ".recharts-cartesian-grid, .recharts-xAxis, .recharts-yAxis",
                );
                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: root,
                        start: "top 82%",
                        once: true,
                    },
                });

                if (axes.length) {
                    timeline.fromTo(
                        axes,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.35, stagger: 0.04, ease: "power2.out" },
                    );
                }

                if (type === "line" || type === "area") {
                    const path = root.querySelector(
                        type === "area" ? ".recharts-area-curve" : ".recharts-line-curve",
                    );
                    const fill = root.querySelector(".recharts-area-area");
                    const dots = root.querySelectorAll(".recharts-dot");

                    if (path instanceof SVGPathElement) {
                        const length = path.getTotalLength();
                        gsap.set(path, {
                            strokeDasharray: length,
                            strokeDashoffset: length,
                        });
                        timeline.to(
                            path,
                            { strokeDashoffset: 0, duration: 1, ease: "power2.out" },
                            axes.length ? "-=0.05" : 0,
                        );
                    }

                    if (fill) {
                        timeline.fromTo(
                            fill,
                            { opacity: 0 },
                            { opacity: 1, duration: 0.55, ease: "power2.out" },
                            "-=0.6",
                        );
                    }

                    if (dots.length) {
                        timeline.fromTo(
                            dots,
                            { opacity: 0, scale: 0, transformOrigin: "50% 50%" },
                            {
                                opacity: 1,
                                scale: 1,
                                duration: 0.28,
                                stagger: 0.05,
                                ease: "back.out(1.8)",
                            },
                            "-=0.2",
                        );
                    }
                }

                if (type === "horizontal-bars") {
                    const bars = root.querySelectorAll(".recharts-bar-rectangle path");
                    timeline.fromTo(
                        bars,
                        { scaleX: 0, transformOrigin: "0% 50%" },
                        {
                            scaleX: 1,
                            duration: 0.7,
                            stagger: 0.09,
                            ease: "power3.out",
                        },
                        axes.length ? "-=0.05" : 0,
                    );
                }

                if (type === "vertical-bars") {
                    const bars = root.querySelectorAll(".recharts-bar-rectangle path");
                    timeline.fromTo(
                        bars,
                        { scaleY: 0, transformOrigin: "50% 100%" },
                        {
                            scaleY: 1,
                            duration: 0.7,
                            stagger: 0.09,
                            ease: "power3.out",
                        },
                        axes.length ? "-=0.05" : 0,
                    );
                }
            });
        }, root);

        return () => {
            if (frameId) window.cancelAnimationFrame(frameId);
            ctx.revert();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return containerRef;
}

export function ReadinessTrendChart({ className = "h-48" }) {
    const gradientId = useId().replaceAll(":", "");
    const containerRef = useChartEntrance("area");

    return (
        <div ref={containerRef} className={`${className} w-full`}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={readinessData}
                    margin={{ top: 12, right: 8, left: -24, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="8%" stopColor="#2F7DD3" stopOpacity={0.26} />
                            <stop offset="92%" stopColor="#2F7DD3" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        vertical={false}
                        stroke="#E0E7EF"
                        strokeDasharray="4 5"
                    />
                    <XAxis
                        dataKey="stage"
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                        tick={{ fontSize: 10, fill: "#66758A" }}
                        tickMargin={10}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                        cursor={{ stroke: "#B8C7E2", strokeDasharray: "4 4" }}
                        content={<ChartTooltip />}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#2F7DD3"
                        strokeWidth={3}
                        fill={`url(#${gradientId})`}
                        dot={{ r: 3, fill: "#FFFFFF", stroke: "#2F7DD3", strokeWidth: 2 }}
                        activeDot={{ r: 5, fill: "#2F7DD3", stroke: "#FFFFFF", strokeWidth: 2 }}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function TopicMasteryChart({ className = "h-52" }) {
    const containerRef = useChartEntrance("horizontal-bars");

    return (
        <div ref={containerRef} className={`${className} w-full`}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={topicMasteryData}
                    layout="vertical"
                    margin={{ top: 4, right: 8, left: 2, bottom: 4 }}
                >
                    <CartesianGrid
                        horizontal={false}
                        stroke="#E0E7EF"
                        strokeDasharray="4 5"
                    />
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis
                        dataKey="topic"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        width={88}
                        tick={{ fontSize: 10, fill: "#314766", fontWeight: 600 }}
                    />
                    <Tooltip
                        cursor={{ fill: "rgba(39,93,245,0.04)" }}
                        content={<ChartTooltip />}
                    />
                    <Bar
                        dataKey="mastery"
                        radius={[0, 5, 5, 0]}
                        barSize={18}
                        isAnimationActive={false}
                    >
                        {topicMasteryData.map((entry) => (
                            <Cell
                                key={entry.topic}
                                fill={entry.mastery < 60 ? "#D4A72C" : "#2F7DD3"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function StudyConsistencyChart({ className = "h-44" }) {
    const gradientId = useId().replaceAll(":", "");
    const containerRef = useChartEntrance("line");

    return (
        <div ref={containerRef} className={`${className} w-full`}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={studyConsistencyData}
                    margin={{ top: 8, right: 8, left: -26, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#7C9BFF" />
                            <stop offset="100%" stopColor="#2F7DD3" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        vertical={false}
                        stroke="#E0E7EF"
                        strokeDasharray="4 5"
                    />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#66758A" }}
                        tickMargin={8}
                    />
                    <YAxis hide domain={[0, 70]} />
                    <Tooltip
                        cursor={{ stroke: "#B8C7E2", strokeDasharray: "4 4" }}
                        content={<ChartTooltip suffix=" min" />}
                    />
                    <Line
                        type="monotone"
                        dataKey="minutes"
                        stroke={`url(#${gradientId})`}
                        strokeWidth={3}
                        dot={{ r: 3, fill: "#FFFFFF", stroke: "#2F7DD3", strokeWidth: 2 }}
                        activeDot={{ r: 5, fill: "#2F7DD3", stroke: "#FFFFFF", strokeWidth: 2 }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export function AssessmentPerformanceChart({ className = "h-48" }) {
    const containerRef = useChartEntrance("vertical-bars");

    return (
        <div ref={containerRef} className={`${className} w-full`}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={assessmentData}
                    margin={{ top: 8, right: 4, left: -24, bottom: 4 }}
                >
                    <CartesianGrid
                        vertical={false}
                        stroke="#E0E7EF"
                        strokeDasharray="4 5"
                    />
                    <XAxis
                        dataKey="assessment"
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        tick={{ fontSize: 9, fill: "#66758A" }}
                        tickMargin={9}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                        cursor={{ fill: "rgba(39,93,245,0.04)" }}
                        content={<ChartTooltip />}
                    />
                    <Bar
                        dataKey="score"
                        fill="#2F7DD3"
                        radius={[5, 5, 0, 0]}
                        barSize={30}
                        isAnimationActive={false}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function ReadinessRadialChart({ value = 84, className = "h-40 w-40" }) {
    const containerRef = useRef(null);
    const valueRef = useRef(null);
    const data = [{ name: "Readiness", value, fill: "#2F7DD3" }];

    useLayoutEffect(() => {
        const root = containerRef.current;
        if (!root) return undefined;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        let frameId;

        const ctx = gsap.context(() => {
            frameId = window.requestAnimationFrame(() => {
                if (reducedMotion) {
                    if (valueRef.current) valueRef.current.textContent = `${value}%`;
                    return;
                }

                const sectors = root.querySelectorAll(".recharts-radial-bar-sector");
                const counter = { value: 0 };
                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: root,
                        start: "top 86%",
                        once: true,
                    },
                });

                timeline.fromTo(
                    sectors,
                    {
                        opacity: 0,
                        scale: 0.72,
                        rotate: -18,
                        transformOrigin: "50% 50%",
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        duration: 0.8,
                        ease: "back.out(1.35)",
                    },
                );

                timeline.to(
                    counter,
                    {
                        value,
                        duration: 0.8,
                        ease: "power2.out",
                        onUpdate: () => {
                            if (valueRef.current) {
                                valueRef.current.textContent = `${Math.round(counter.value)}%`;
                            }
                        },
                    },
                    0,
                );
            });
        }, root);

        return () => {
            if (frameId) window.cancelAnimationFrame(frameId);
            ctx.revert();
        };
    }, [value]);

    return (
        <div
            ref={containerRef}
            className={`relative flex items-center justify-center ${className}`}
        >
            <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="73%"
                        outerRadius="100%"
                        barSize={10}
                        data={data}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background={{ fill: "#E8EEF8" }}
                            dataKey="value"
                            cornerRadius={20}
                            isAnimationActive={false}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
            <div className="relative flex flex-col items-center justify-center">
        <span
            ref={valueRef}
            className="text-3xl font-bold tracking-tight text-[#273452]"
        >
          0%
        </span>
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#66758A]">
          Ready
        </span>
            </div>
        </div>
    );
}