import ContactComponent from '../components/contact-components';
import ContactForm from '../components/contact-form';

export default function ContactPage() {
  return (
    <div className="w-5/6 h-full flex flex-row jusitfy-center mx-auto my-8">
      <ContactComponent />
      <ContactForm />
    </div>
  )
}