import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

function StatCard({ title, value, subtitle, trend, icon: Icon, color = "primary" }) {
    const colorClasses = {
        primary: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        error: "bg-error/10 text-error",
        info: "bg-info/10 text-info",
    };

    return (
        <div className="stats shadow bg-base-100">
            <div className="stat">
                <div className="stat-figure text-primary">
                    {Icon && (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                    )}
                </div>
                <div className="stat-title text-base-content/60">{title}</div>
                <div className="stat-value text-3xl">{value}</div>
                {subtitle && <div className="stat-desc">{subtitle}</div>}
                {trend && (
                    <div className={`stat-desc flex items-center gap-1 mt-1 ${trend.direction === "up" ? "text-success" : "text-error"}`}>
                        {trend.direction === "up" ? (
                            <ArrowUpIcon className="w-4 h-4" />
                        ) : (
                            <ArrowDownIcon className="w-4 h-4" />
                        )}
                        <span>{trend.value}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StatCard;
