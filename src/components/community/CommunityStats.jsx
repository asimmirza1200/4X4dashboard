import React from "react";
import {
  FiUsers,
  FiMessageSquare,
  FiHeart,
  FiTrendingUp,
  FiEye,
  FiFlag,
  FiBarChart2,
  FiActivity
} from "react-icons/fi";
import { Card, Badge } from "@windmill/react-ui";

const CommunityStats = ({ stats }) => {
  const statCards = [
    {
      title: "Total Posts",
      value: stats?.totalPosts || 0,
      change: stats?.postsChange || "+0%",
      changeType: stats?.postsChangeType || "positive",
      icon: FiMessageSquare,
      color: "blue"
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      change: stats?.usersChange || "+0%",
      changeType: stats?.usersChangeType || "positive",
      icon: FiUsers,
      color: "green"
    },
    {
      title: "Total Likes",
      value: stats?.totalLikes || 0,
      change: stats?.likesChange || "+0%",
      changeType: stats?.likesChangeType || "positive",
      icon: FiHeart,
      color: "red"
    },
    {
      title: "Engagement Rate",
      value: `${stats?.engagementRate || 0}%`,
      change: stats?.engagementChange || "+0%",
      changeType: stats?.engagementChangeType || "positive",
      icon: FiActivity,
      color: "purple"
    },
    {
      title: "Pending Posts",
      value: stats?.pendingPosts || 0,
      change: stats?.pendingChange || "+0%",
      changeType: stats?.pendingChangeType || "neutral",
      icon: FiEye,
      color: "yellow"
    },
    {
      title: "Reported Posts",
      value: stats?.reportedPosts || 0,
      change: stats?.reportedChange || "+0%",
      changeType: stats?.reportedChangeType || "negative",
      icon: FiFlag,
      color: "red"
    }
  ];

  const getColorClasses = (color, type = "bg") => {
    const colors = {
      blue: {
        bg: "bg-blue-500",
        light: "bg-blue-100",
        dark: "dark:bg-blue-900",
        text: "text-blue-600",
        darkText: "dark:text-blue-400"
      },
      green: {
        bg: "bg-green-500",
        light: "bg-green-100",
        dark: "dark:bg-green-900",
        text: "text-green-600",
        darkText: "dark:text-green-400"
      },
      red: {
        bg: "bg-red-500",
        light: "bg-red-100",
        dark: "dark:bg-red-900",
        text: "text-red-600",
        darkText: "dark:text-red-400"
      },
      yellow: {
        bg: "bg-yellow-500",
        light: "bg-yellow-100",
        dark: "dark:bg-yellow-900",
        text: "text-yellow-600",
        darkText: "dark:text-yellow-400"
      },
      purple: {
        bg: "bg-purple-500",
        light: "bg-purple-100",
        dark: "dark:bg-purple-900",
        text: "text-purple-600",
        darkText: "dark:text-purple-400"
      }
    };
    return colors[color] || colors.blue;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 mt-6">
      {statCards.map((stat, index) => {
        const colorClasses = getColorClasses(stat.color);
        const Icon = stat.icon;
        
        return (
          <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {formatNumber(stat.value)}
                </p>
                <div className="flex items-center mt-2">
                  <FiTrendingUp className={`w-3 h-3 mr-1 ${
                    stat.changeType === "positive" ? "text-green-500" :
                    stat.changeType === "negative" ? "text-red-500" :
                    "text-gray-500"
                  }`} />
                  <span className={`text-xs font-medium ${
                    stat.changeType === "positive" ? "text-green-500" :
                    stat.changeType === "negative" ? "text-red-500" :
                    "text-gray-500"
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    vs last period
                  </span>
                </div>
              </div>
              
              <div className={`w-12 h-12 ${colorClasses.light} ${colorClasses.dark} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${colorClasses.text} ${colorClasses.darkText}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CommunityStats;
