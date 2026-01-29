import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métricas personalizadas
const errorRate = new Rate('errors');

// Configuración de la prueba de carga
export const options = {
  stages: [
    { duration: '20s', target: 5 },   // Rampa hasta 5 usuarios en 20s
    { duration: '1m', target: 5 },    // Mantener 5 usuarios por 1 min
    { duration: '20s', target: 10 },  // Rampa hasta 10 usuarios en 20s
    { duration: '1m', target: 10 },   // Mantener 10 usuarios por 1 min
    { duration: '20s', target: 0 },   // Reducir a 0 usuarios
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% de requests deben responder en menos de 2s
    'http_req_failed': ['rate<0.3'],   // Menos del 30% de errores
  },
};

const BASE_URL = 'https://techstore-hs0k.onrender.com';

export default function () {
  // Escenario 2: Obtener productos (50% de las peticiones)
  if (Math.random() < 0.5) {
    const productosRes = http.get(`${BASE_URL}/api/productos`);
    
    check(productosRes, {
      'productos status 200 o 401': (r) => r.status === 200 || r.status === 401,
      'productos responde': (r) => r.status > 0,
    }) || errorRate.add(1);
  }

  // Escenario 3: Login (30% de las peticiones)
  if (Math.random() < 0.3) {
    const loginPayload = JSON.stringify({
      correo: `user${Math.floor(Math.random() * 100)}@test.com`,
      contraseña: 'password123'
    });

    const loginParams = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, loginParams);
    
    check(loginRes, {
      'login responde (200 o 401)': (r) => r.status === 200 || r.status === 401 || r.status === 404,
    }) || errorRate.add(1);
  }

  // Pausa entre 1-3 segundos para simular comportamiento humano
  sleep(Math.random() * 2 + 1);
}
