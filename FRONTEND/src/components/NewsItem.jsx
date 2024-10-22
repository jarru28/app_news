import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

const NewsItem=({ item, onAction, actionText, actionVariant })=> {

    const News = {
        id: item._id,
        title: item.title || 'Untitled',
        author: item.author || 'Anonymous',
        archiveDate: item.archiveDate,
        date: new Date(item.date) || Date.now(),
        description: item.description || 'No description',
        content: item.content || 'No content',
    }

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
        <strong><span>{News.title}</span></strong>
          <Badge bg="info" pill>{item.author}</Badge>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {News.archiveDate 
            ? `Archived on: ${new Date(News.archiveDate).toLocaleDateString()}`
            : `Published on: ${News.date.toLocaleDateString()}`
          }
        </Card.Subtitle>
        <Card.Text className="border-bottom border-primary pl-3 my-3">
            {News.description}
        </Card.Text>
        <Card.Text className="text-muted small">
            {News.content}
        </Card.Text>
        <Button 
          variant={actionVariant} 
          onClick={() => onAction(News.id)}
          className="float-right"
        >
          {actionText}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default NewsItem;