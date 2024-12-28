import { jest } from '@jest/globals';

// Mock environment variables for testing
process.env.SMTP_HOST = 'smtp.example.com';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = 'test@example.com';
process.env.SMTP_PASS = 'password';
process.env.ALERT_EMAIL = 'alerts@example.com';
process.env.DINGDING_WEBHOOK = 'https://dingding.example.com/webhook';
process.env.WECOM_WEBHOOK = 'https://wecom.example.com/webhook';

// Mock nodemailer
const mockSendMail = jest.fn().mockImplementation(() => 
  Promise.resolve({
    messageId: 'test-message-id',
    response: '250 Message accepted'
  })
);

const mockCreateTransport = jest.fn().mockReturnValue({
  sendMail: mockSendMail
});

jest.mock('nodemailer', () => ({
  createTransport: mockCreateTransport
}));

// Mock axios
const mockAxiosResponse = {
  data: { errcode: 0 },
  status: 200,
  statusText: 'OK'
};

const mockPost = jest.fn().mockImplementation(() => 
  Promise.resolve(mockAxiosResponse)
);

jest.mock('axios', () => ({
  post: mockPost,
  default: {
    post: mockPost
  }
}));
