import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, CheckCheck } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getBadgeConfig = (st) => {
    switch (st) {
      case 'Pending':
        return { className: 'badge-pending', icon: <Clock size={14} />, text: 'Pending Approval' };
      case 'Confirmed':
        return { className: 'badge-confirmed', icon: <CheckCircle2 size={14} />, text: 'Confirmed' };
      case 'Completed':
        return { className: 'badge-completed', icon: <CheckCheck size={14} />, text: 'Completed' };
      case 'Cancelled':
        return { className: 'badge-cancelled', icon: <XCircle size={14} />, text: 'Cancelled' };
      case 'Rejected':
        return { className: 'badge-rejected', icon: <AlertCircle size={14} />, text: 'Rejected' };
      default:
        return { className: 'badge-pending', icon: <Clock size={14} />, text: st };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <span className={`badge ${config.className}`}>
      {config.icon}
      {config.text}
    </span>
  );
};

export default StatusBadge;
