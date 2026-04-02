import { useLanguage } from "@/contexts/LanguageContext";
import { projects } from "@/data/mock";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Building2 } from "lucide-react";

export function Projects() {
  const { t, lang } = useLanguage();

  return (
    <section id="projetos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            {t.projects.subtitle}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.projects.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t.projects.description}
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-10">
            {projects.map((project, index) => {
              const title = lang === "en" ? project.titleEn : project.title;
              const description = lang === "en" ? project.descriptionEn : project.description;
              const type = lang === "en" ? project.typeEn : project.type;
              const status = lang === "en" ? project.statusEn : project.status;

              return (
                <div key={project.id} className="relative flex gap-8 group">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center z-10 relative group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <span className="text-primary font-bold text-sm group-hover:text-white transition-colors">
                        {String(project.year).slice(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 pb-2">
                    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow duration-300">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge className="text-xs bg-primary/10 text-primary border-0">
                          {type}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarDays className="w-3 h-3" />
                          {project.year}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium ml-auto">
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                          {status}
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        {project.logo ? (
                          <div className="flex-shrink-0">
                            <img
                              src={project.logo}
                              alt={`${project.partner} logo`}
                              className="max-h-10 max-w-[100px] object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 flex items-center gap-1.5 text-muted-foreground">
                            <Building2 className="w-4 h-4" />
                            <span className="text-xs font-semibold text-foreground">
                              {project.partner}
                            </span>
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="font-bold text-foreground text-base mb-2 leading-snug">
                            {title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute left-4 bottom-0 w-4 h-4 rounded-full border-2 border-primary bg-background" />
        </div>

        <div className="text-center mt-12">
          <a
            href="#contato"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline underline-offset-4 transition"
          >
            {t.projects.contact} →
          </a>
        </div>
      </div>
    </section>
  );
}
