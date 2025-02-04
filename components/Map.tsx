"use client"

import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export default function Map() {
  return (
    <Card className="w-full overflow-hidden">
      <div className="relative w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.2486917489883!2d2.3604!3d48.8545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e19815e6d85%3A0x7c0e2b2799ef5d13!2s20%20Rue%20Malher%2C%2075004%20Paris%2C%20France!5e0!3m2!1sen!2sus!4v1707000000000!5m2!1sen!2sus"
          className="w-full h-[300px] border-none"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
       
      </div>
    </Card>
  )
}

