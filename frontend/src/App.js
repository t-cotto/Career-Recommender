import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import HomeScreen from './pages/HomeScreen';
import QuizScreen from './pages/QuizScreen';
import RegisterScreen from './pages/RegisterScreen';
import LoginScreen from './pages/LoginScreen';

import QuizResultScreen from './pages/QuizResultScreen';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-5">
        <Container>
          <Route path="/" component={HomeScreen} exact />
          <Route path="/quiz/:factor/question" component={QuizScreen} />
          <Route path="/quiz/results" component={QuizResultScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/login" component={LoginScreen} />
        </Container>
      </main>
    </Router>
  );
}

export default App;
