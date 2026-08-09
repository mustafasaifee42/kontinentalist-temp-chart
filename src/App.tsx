import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react/Spinner';
import Papa from 'papaparse';
import Viz from './VIz';

import '@/styles/fonts.css';
import '@/styles/style.css';
import type { DataType } from './Types';

function useCityData(city: string) {
  return useQuery({
    queryKey: ['getCityData', city],
    queryFn: () =>
      new Promise((resolve, reject) => {
        Papa.parse(`/data/${city}.csv`, {
          download: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          header: true,
          delimiter: ',',
          complete(results) {
            resolve(results.data);
          },
          error(error) {
            reject(error);
          },
        });
      }),
  });
}

function App() {
  const city = 'Abu Dhabi';
  const { data, isLoading, isError } = useCityData(city.replaceAll(' ', '-'));

  if (isLoading) return <Spinner size='lg' className='mx-auto my-20' />;

  if (isError) return <>Error</>;

  if (!data) return <Spinner size='lg' className='mx-auto my-20' />;
  return <Viz data={data as DataType[]} city={city} />;
}

export default App;
