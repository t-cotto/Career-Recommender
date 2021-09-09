import React from 'react';
import { Accordion, Card, Image, Col, Row } from 'react-bootstrap';

/* Accordion component to hold data on each career recommendation for display on the home screen*/
function CareerRecommendations({ career }) {
  return (
    <div data-testid="career-recommendation-component">
      <Accordion>
        <Card style={{ textAlign: 'left' }}>
          <Accordion.Toggle
            as={Card.Header}
            eventKey="0"
            style={{ padding: 20 }}
          >
            <Row>
              <Col>{career.careerTitle}</Col>
              {career.matchScore && (
                <Col style={{ textAlign: 'right' }}>
                  <strong>{career.matchScore}</strong>
                </Col>
              )}
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              {career.associatedImage && (
                <Image
                  src={career.associatedImage}
                  style={{ marginBottom: 10 }}
                  fluid
                />
              )}
              {career.avgSalary && (
                <h6
                  style={{
                    color: 'grey',
                    marginTop: 10,
                  }}
                >
                  Avg Salary: £ {career.avgSalary}
                </h6>
              )}
              {career.associatedPersonalityType && (
                <h6
                  style={{
                    color: 'grey',
                    marginTop: 10,
                  }}
                >
                  Personality Type: {career.associatedPersonalityType}
                </h6>
              )}
              <p style={{ textAlign: 'center', marginTop: 40 }}>
                {career.careerDescription}
              </p>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}

export default CareerRecommendations;
