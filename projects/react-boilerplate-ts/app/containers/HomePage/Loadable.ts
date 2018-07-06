/**
 * Asynchronously loads the component for HomePage
 */
import * as Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
