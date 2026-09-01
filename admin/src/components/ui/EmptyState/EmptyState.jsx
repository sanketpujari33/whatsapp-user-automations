import PropTypes from 'prop-types';
import { Button } from 'components/ui';

export default function EmptyState({ icon = '📭', title = 'No data found', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-50 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md">{description}</p>}
      {action && <Button onClick={action}>{action.props?.children || 'Add New'}</Button>}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
};
