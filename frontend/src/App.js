import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  const [formData, setFormData] = useState({
    partName: '',
    make: '',
    model: '',
    year: '',
    trim: '',
    warranty: '',
    marketPrice: '',
    margin: '',
    shipping: '',
    totalPrice: 0,
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'danger'
  const [loading, setLoading] = useState(false);

  // Auto-calculate totalPrice
  useEffect(() => {
    const mp = parseFloat(formData.marketPrice) || 0;
    const marg = parseFloat(formData.margin) || 0;
    const ship = parseFloat(formData.shipping) || 0;

    if (mp > 0 && marg >= 0 && ship >= 0) {
      const marginAmount = (mp * marg) / 100;
      const total = mp + marginAmount + ship;
      setFormData((prev) => ({ ...prev, totalPrice: total.toFixed(2) }));
    } else {
      setFormData((prev) => ({ ...prev, totalPrice: 0 }));
    }
  }, [formData.marketPrice, formData.margin, formData.shipping]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const payload = {
        partName: formData.partName,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        trim: formData.trim,
        warranty: formData.warranty || undefined,
        marketPrice: Number(formData.marketPrice),
        margin: Number(formData.margin),
        shipping: Number(formData.shipping),
        totalPrice: Number(formData.totalPrice),
      };

      await axios.post('http://localhost:5000/api/parts', payload);

      setMessage('Part added successfully!');
      setMessageType('success');

      // Reset form
      setFormData({
        partName: '',
        make: '',
        model: '',
        year: '',
        trim: '',
        warranty: '',
        marketPrice: '',
        margin: '',
        shipping: '',
        totalPrice: 0,
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding part');
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white text-center">
              <h3 className="mb-0">Add New Auto Part</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {message && (
                <Alert variant={messageType} dismissible onClose={() => setMessage('')}>
                  {message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Part Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="partName"
                        placeholder="e.g., Front Brake Rotor"
                        value={formData.partName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Make</Form.Label>
                      <Form.Control
                        type="text"
                        name="make"
                        placeholder="e.g., Toyota"
                        value={formData.make}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Model</Form.Label>
                      <Form.Control
                        type="text"
                        name="model"
                        placeholder="e.g., Camry"
                        value={formData.model}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Year</Form.Label>
                      <Form.Control
                        type="number"
                        name="year"
                        placeholder="e.g., 2023"
                        value={formData.year}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Trim</Form.Label>
                      <Form.Control
                        type="text"
                        name="trim"
                        placeholder="e.g., XSE, Touring"
                        value={formData.trim}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Warranty (optional)</Form.Label>
                      <Form.Control
                        type="text"
                        name="warranty"
                        placeholder="e.g., 24 months"
                        value={formData.warranty}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Market Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="marketPrice"
                        placeholder="0.00"
                        value={formData.marketPrice}
                        onChange={handleChange}
                        step="0.01"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Margin (%)</Form.Label>
                      <Form.Control
                        type="number"
                        name="margin"
                        placeholder="e.g., 25"
                        value={formData.margin}
                        onChange={handleChange}
                        step="0.01"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Shipping Cost</Form.Label>
                      <Form.Control
                        type="number"
                        name="shipping"
                        placeholder="0.00"
                        value={formData.shipping}
                        onChange={handleChange}
                        step="0.01"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-center mb-4">
                  <h5>
                    Total Price:{' '}
                    <span className="text-primary fw-bold">
                      ${formData.totalPrice}
                    </span>
                  </h5>
                </div>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Adding...' : 'Add Part'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;