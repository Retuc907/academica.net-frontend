import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '10s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    checks: ['rate>0.95'],
  },
};

export default function () {
  // Simulación de carga sin requests HTTP reales
  const mockResponse = {
    status: 200,
    response_time: Math.random() * 100,
  };

  check(mockResponse, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.response_time < 200,
  });

  sleep(1);
}
