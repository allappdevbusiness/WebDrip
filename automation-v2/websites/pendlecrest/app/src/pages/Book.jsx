import Layout from '../components/Layout.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { BookHeader, Ways, Booking, Quiz, Postal, Bench, Gallery, Team, Find, Track, BookingQuestions, Contact } from '../sections/book.jsx';

export const bookCredits = ['pocketTable', 'pocketSilver', 'pocketChain', 'pocketYellow', 'watchRow', 'mapDial', 'fieldWatch'];

export default function Book() {
  return (
    <Layout current="book" credits={bookCredits}>
      <BookHeader />
      <Ways />
      <Booking />
      <Quiz />
      <Postal />
      <Bench />
      <Gallery />
      <Team />
      <Find />
      <Track />
      <BookingQuestions />
      <Contact />
      <Newsletter />
    </Layout>
  );
}
