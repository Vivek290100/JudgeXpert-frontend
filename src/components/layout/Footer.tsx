import { Code2, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-forground py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        {/* Left: Logo + Tagline */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary">JudgeXpert</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Code at the speed of no-code.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-2">
            <Github className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
            <Twitter className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
            <img src="/discord-icon.svg" alt="Discord" className="w-5 h-5 cursor-pointer" />
            <Linkedin className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
          </div>
        </div>

        {/* Right: Community & Legal Sections */}
        <div className="grid grid-cols-2 gap-12 text-sm text-muted-foreground">
          {/* Community */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Community</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-foreground">GitHub</a></li>
              <li><a href="mailto:support@judgexpert.com" className="hover:text-foreground">Email</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Legal</h3>
            <ul className="space-y-1">
              <li><a href="/terms" className="hover:text-foreground">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-foreground">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
