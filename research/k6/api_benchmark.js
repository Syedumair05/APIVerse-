import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    // Number of virtual users
    vus: Number(__ENV.VUS || 1),

    // Test duration
    duration: __ENV.DURATION || '30s',

    // Always report these latency statistics
    summaryTrendStats: [
        'avg',
        'min',
        'med',
        'max',
        'p(90)',
        'p(95)',
        'p(99)',
    ],
};

export default function () {
    const response = http.get(
        'http://localhost:5000/api/countries?page=1&limit=12'
    );

    check(response, {
        'status is 200': (r) => r.status === 200,
        'success is true': (r) => {
            try {
                return r.json('success') === true;
            } catch {
                return false;
            }
        },
    });

    // Controlled pacing between requests.
    // This avoids an uncontrolled maximum-speed request loop.
    sleep(0.1);
}