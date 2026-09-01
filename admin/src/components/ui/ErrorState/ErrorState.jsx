import PropTypes from 'prop-types';
import { Button } from 'components/ui';

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-50 mb-1">Error</h3>
      <p className="text-sm text-red-500 dark:text-red-400 mb-4 max-w-md">{message}</p>
      {onRetry && <Button onClick={onRetry}>Try Again</Button>}
    </div>
  );
}

ErrorState.propTypes = { message: PropTypes.string, onRetry: PropTypes.func };
