import { useLanguage } from "@/contexts/LanguageContext";
import { projects } from "@/data/mock";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarDays, Building2 } from "lucide-react";

export function Projects() {
  const { t, lang } = useLanguage();

  return (
    <section id="projetos" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
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

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {projects.map((project) => {
              const title = lang === "en" ? project.titleEn : project.title;
              const description = lang === "en" ? project.descriptionEn : project.description;
              const type = lang === "en" ? project.typeEn : project.type;
              const status = lang === "en" ? project.statusEn : project.status;

              return (
                <AccordionItem
                  key={project.id}
                  value={String(project.id)}
                  className="bg-card border border-border rounded-xl px-5 shadow-sm data-[state=open]:border-primary/40 transition-colors"
                >
                  <AccordionTrigger className="hover:no-underline py-5 gap-4">
                    <div className="flex items-center gap-4 text-left flex-1 min-w-0">
                      {project.logo ? (
                        <img
                          src={project.logo}
                          alt={`${project.partner} logo`}
                          className="h-8 max-w-[80px] object-contain flex-shrink-0"
                        />
                      ) : (
                        <div className="flex items-center gap-1.5 flex-shrink-0 text-muted-foreground">
                          <Building2 className="w-4 h-4" />
                          <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                            {project.partner}
                          </span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
                          {title}
                        </p>
                      </div>

                      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                        <Badge className="text-xs bg-primary/10 text-primary border-0 whitespace-nowrap">
                          {type}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                          <CalendarDays className="w-3 h-3" />
                          {project.year}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-5">
                    <div className="flex sm:hidden items-center gap-2 mb-3">
                      <Badge className="text-xs bg-primary/10 text-primary border-0">
                        {type}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="w-3 h-3" />
                        {project.year}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        {status}
                      </span>
                      {!project.logo && (
                        <span className="text-xs text-muted-foreground">
                          {project.partner}
                        </span>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <div className="text-center mt-10">
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
