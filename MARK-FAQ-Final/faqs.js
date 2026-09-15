/* MARK GROUPS — Knowledge Hub
   FAQ interactions only.
   This file is designed to work with the existing MARK website HTML/CSS.
   No global website styles are changed here.
*/

(() => {
  "use strict";

  const state = {
    activeCategory: "all",
    searchTerm: "",
    currentPage: 1,
    perPage: 8,
    openFaqId: null
  };

  const categoryLabels = {
    interiors: "Interiors",
    construction: "Construction",
    furniture: "Custom Furniture",
    "real-estate": "Real Estate",
    projects: "Projects"
  };

  /*
    Add or edit questions here.
    Keep each id unique because featured question links use these IDs.
  */
  const FAQ_DATABASE = [
    {
      id: "faq-interior-cost",
      category: "interiors",
      question: "How much do home interiors cost in Hyderabad?",
      answer:
        "Interior cost is driven by scope, storage requirements, materials, hardware, civil changes, lighting and finish level—not simply carpet area. A dependable quotation should follow your floor plan and a written specification with clear inclusions, exclusions and quantities, so proposals can be compared on value rather than a headline price.",
      keywords: "interior cost budget price Hyderabad home interiors"
    },
    {
      id: "faq-interior-process",
      category: "interiors",
      question: "What is the process for starting an interior design project?",
      answer:
        "A well-managed project starts with a brief, site measurement and budget discussion, then moves through space planning, concepts, 3D views, working drawings, material selection and a detailed quotation. Procurement and execution should begin only after the scope is approved; this prevents costly assumptions and late-stage changes.",
      keywords: "interior process design execution turnkey"
    },
    {
      id: "faq-interior-timeline",
      category: "interiors",
      question: "How long does a complete home interior project take?",
      answer:
        "The timeline depends on the size of the home, approvals, civil work, material lead times, factory production and site readiness. Ask for a stage-wise programme—design freeze, production, site work, installation and handover—rather than a single promise, and confirm how variations affect the schedule.",
      keywords: "interior timeline duration project completion"
    },
    {
      id: "faq-interior-design-only",
      category: "interiors",
      question: "Can I choose only interior design without execution?",
      answer:
        "Yes. A design-only service can include space planning, concepts, 3D views, detailed working drawings, furniture layouts, electrical points, ceiling plans and material specifications. It is a strong option when you already have a trusted contractor, provided the drawing set is detailed enough for accurate execution.",
      keywords: "design only interior drawings 3D execution"
    },
    {
      id: "faq-interior-materials",
      category: "interiors",
      question: "Which materials are commonly used for home interiors?",
      answer:
        "Home interiors commonly use plywood, MDF, HDHMR, laminates, acrylic, veneer, glass, metal and stone, with hardware selected for the load and frequency of use. The right choice depends on moisture exposure, intended use, finish, maintenance expectations and budget; one material is not right for every room.",
      keywords: "plywood MDF laminate acrylic veneer materials wardrobe materials"
    },
    {
      id: "faq-interior-modular-kitchen",
      category: "interiors",
      question: "How is a modular kitchen planned and priced?",
      answer:
        "A modular kitchen should be planned around the work triangle, storage habits, appliance sizes, ventilation and comfortable clearances. Its cost is shaped by cabinet dimensions, carcass and shutter materials, hardware, countertop, accessories and installation; final pricing should follow an on-site measurement and itemised specification.",
      keywords: "modular kitchen layout pricing storage"
    },
    {
      id: "faq-interior-maintenance",
      category: "interiors",
      question: "How can I maintain my home interiors for a longer life?",
      answer:
        "Use surface-appropriate cleaners, keep water away from board edges, avoid overloading shelves and drawers, and address leaks or seepage immediately. At handover, ask for material-specific care guidance and warranty contacts; regular adjustment of hinges and channels can prevent small issues becoming repairs.",
      keywords: "maintenance cleaning laminate wardrobe kitchen"
    },
    {
      id: "faq-construction-cost",
      category: "construction",
      question: "What factors decide the cost of house construction?",
      answer:
        "Construction cost depends on built-up area, structural design, soil condition, foundation type, number of floors, material specifications, labour, elevation, services, finishes and site accessibility. A reliable quotation should clearly mention inclusions, exclusions, specifications and payment stages.",
      keywords: "construction cost house building estimate turnkey construction"
    },
    {
      id: "faq-construction-plan",
      category: "construction",
      question: "What drawings are required before starting construction?",
      answer:
        "Depending on the project, drawings may include architectural plans, site plan, elevation, sections, structural drawings, electrical layouts, plumbing layouts, door and window schedules, staircase details and service drawings. Approvals and local requirements should be checked before work begins.",
      keywords: "construction drawings architectural structural approvals"
    },
    {
      id: "faq-construction-timeline",
      category: "construction",
      question: "How long does it take to construct a house?",
      answer:
        "Construction duration depends on the size, number of floors, soil and foundation conditions, weather, approvals, labour availability, material supply and finish level. A stage-wise programme is more useful than a single general promise because every site has different conditions.",
      keywords: "house construction duration timeline stages"
    },
    {
      id: "faq-construction-contract",
      category: "construction",
      question: "What should be included in a construction agreement?",
      answer:
        "A construction agreement should define the scope, specifications, drawings, rate or total contract value, payment milestones, material responsibilities, timeline, quality standards, variation process, exclusions, defect liability, termination terms and dispute resolution process.",
      keywords: "construction agreement contract terms payment milestones"
    },
    {
      id: "faq-construction-quality",
      category: "construction",
      question: "How do you maintain quality during construction?",
      answer:
        "Quality is maintained through approved drawings, proper material selection, stage-wise inspections, workmanship checks, coordination between trades, measurement records and documented approvals. Important stages should be reviewed before the next stage is covered.",
      keywords: "construction quality inspection workmanship"
    },
    {
      id: "faq-furniture-cost",
      category: "furniture",
      question: "Is custom furniture more expensive than ready-made furniture?",
      answer:
        "Custom furniture is not always more expensive. The cost depends on dimensions, material, hardware, finish, complexity, quantity and installation. Custom furniture can provide better space utilisation and a more consistent design, especially for kitchens, wardrobes and built-in storage.",
      keywords: "custom furniture cost ready made comparison"
    },
    {
      id: "faq-furniture-process",
      category: "furniture",
      question: "What is the process for ordering custom furniture?",
      answer:
        "The process generally includes requirement discussion, measurements, design approval, material and finish selection, quotation confirmation, production, quality checking, delivery and installation. Final dimensions should be verified before manufacturing.",
      keywords: "custom furniture order manufacturing installation"
    },
    {
      id: "faq-furniture-hardware",
      category: "furniture",
      question: "Why is hardware important in modular furniture?",
      answer:
        "Hinges, drawer channels, lift-up systems, baskets and connectors directly affect movement, load capacity, safety, durability and user experience. Hardware should be selected according to the size, weight, frequency of use and budget of the furniture.",
      keywords: "modular furniture hinges drawer channels hardware"
    },
    {
      id: "faq-furniture-warranty",
      category: "furniture",
      question: "What should I check before accepting custom furniture?",
      answer:
        "Check dimensions, alignment, door gaps, drawer movement, laminate or finish quality, edge banding, hardware operation, wall fixing, cleanliness and any agreed accessories. Any pending items should be recorded in a handover or snag list.",
      keywords: "furniture handover checklist quality inspection"
    },
    {
      id: "faq-property-documents",
      category: "real-estate",
      question: "What documents should I check before buying a property?",
      answer:
        "Document requirements vary by property and location. Common checks include title documents, link documents, encumbrance details, approved plans, permissions, tax records, identity details, agreement terms and applicable project or registration records. A qualified property lawyer should verify the documents before purchase.",
      keywords: "property documents title encumbrance legal verification plot documents"
    },
    {
      id: "faq-property-rera",
      category: "real-estate",
      question: "What is RERA approval and why does it matter?",
      answer:
        "RERA (Real Estate Regulatory Authority) approval means a project is registered with the state authority and its details, approvals and timelines are on public record. Checking a project's RERA registration number and status is a useful step before booking, alongside independent legal verification.",
      keywords: "RERA approval real estate registration"
    },
    {
      id: "faq-property-home-loan",
      category: "real-estate",
      question: "What should I keep ready if I plan to use a home loan?",
      answer:
        "Lenders typically look at income proof, identity and address documents, property title and approval documents, and the property's estimated value. Loan eligibility, interest rate and tenure vary by lender and applicant profile, so it is best to confirm current terms directly with your bank or financial institution.",
      keywords: "home loan documents eligibility property purchase"
    },
    {
      id: "faq-property-location",
      category: "real-estate",
      question: "What should I consider when choosing a property location?",
      answer:
        "Consider road access, connectivity, neighbourhood development, water and drainage, electricity, nearby schools and hospitals, future infrastructure, flood risk, legal status, surrounding land use and resale or rental demand. Location suitability depends on your personal and investment goals.",
      keywords: "real estate location buying investment connectivity vaastu"
    },
    {
      id: "faq-property-investment",
      category: "real-estate",
      question: "Is buying land better than buying a ready property?",
      answer:
        "There is no single answer for every buyer. Land may offer flexibility and long-term appreciation potential, while a ready property may provide immediate use or rental income. The decision should consider budget, holding period, legal verification, location, development plans and maintenance responsibilities.",
      keywords: "land vs ready property real estate investment"
    },
    {
      id: "faq-project-consultation",
      category: "projects",
      question: "Can MARK help with both design and execution?",
      answer:
        "Yes. Depending on the project requirement, MARK can support design, planning, material selection, construction, interiors, custom furniture and related execution coordination. The exact deliverables should be confirmed in the project proposal.",
      keywords: "MARK design execution construction interiors"
    },
    {
      id: "faq-project-site-visit",
      category: "projects",
      question: "How can I request a site visit or consultation?",
      answer:
        "You can submit your requirements through the contact form with your name, phone number, project type, location and a short description. The team can then review the information and coordinate the next step.",
      keywords: "site visit consultation contact enquiry"
    }
  ];

  const INTERIOR_FAQ_ADDITIONS = [
    ["What does an interior designer do?", "An interior designer translates your needs into a coordinated layout, storage, lighting, materials and drawing set, so decisions are resolved before construction or fabrication begins.", "interior designer role planning"],
    ["Do I need an interior designer for a small house?", "Yes, when you want every square foot to work harder. Good planning improves storage, furniture scale, movement and light—areas where small homes have the least room for error.", "small house space planning"],
    ["What is included in an interior design package?", "Confirm the written deliverables: layouts, concepts, 3D views, working drawings, material schedules, site visits and revisions. A package name alone does not define the scope.", "interior package scope deliverables"],
    ["What is the difference between interior design and interior execution?", "Design defines what will be made through drawings and specifications; execution is procurement, fabrication, site coordination, installation and quality control that delivers it.", "design execution difference"],
    ["Can an interior designer work with my existing furniture?", "Yes. Share photographs and dimensions early so worthwhile pieces can be assessed and integrated into the new layout, palette and lighting plan.", "existing furniture reuse"],
    ["Can I hire an interior designer for one room?", "Yes. A focused design for a kitchen, bedroom, living room or home office can improve usability and avoid expensive mistakes, even without a whole-home project.", "one room interior design"],
    ["What information should I provide before starting interior design?", "Provide the floor plan, possession date, household needs, budget range, inspiration, appliances to retain and non-negotiables. Clear inputs create a more accurate design and estimate.", "interior brief floor plan budget"],
    ["Can interior design be done within a fixed budget?", "Yes, if the budget is set before design finalisation. Prioritise essentials, approve specifications early and treat upgrades as separate choices rather than unplanned additions.", "fixed budget cost control"],
    ["How do I plan interiors for a 2BHK, 3BHK or 4BHK?", "Start with household routines, storage needs and the rooms that matter most. A room-by-room brief and total budget allocate space and finishes intelligently.", "2BHK 3BHK 4BHK planning"],
    ["How much should I budget for a complete home interior?", "Budget by scope—kitchen, wardrobes, loose furniture, ceilings, lights, civil work and finishes—and keep a contingency for approved site changes. An itemised estimate is more reliable than one rate.", "complete home interior budget"],
    ["Is 3D interior design included in the package?", "It may be included for selected rooms, but confirm this in writing. 3D views communicate appearance; detailed drawings and specifications still control actual execution.", "3D design package"],
    ["Are working drawings included in interior design?", "They should be, especially if another contractor will execute. Dimensioned layouts, elevations, sections and material notes prevent site teams from relying on verbal instructions.", "working drawings execution"],
    ["Will the designer provide electrical and plumbing layouts?", "For spaces affected by the project, these layouts should be resolved before walls and ceilings close. Confirm whether they are conceptual or execution-ready, and who approves site changes.", "electrical plumbing layouts"],
    ["Can I change the design after approval?", "Yes, but every change can affect cost, materials and timeline. Approve the revised drawing, quotation impact and delivery implication in writing before work proceeds.", "design change variation"],
    ["How many design revisions are usually allowed?", "The agreement should state the revisions included at each design stage and the process for extra revisions. A clear brief reduces iterations and protects the schedule.", "design revisions agreement"],
    ["Can I choose my own materials and finishes?", "Yes. Approve physical samples or a material board—not only images—while considering suitability, maintenance, availability and cost for each location.", "choose materials finishes"],
    ["How do I compare two interior design quotations?", "Compare scope, dimensions, board thickness, brands, hardware, finish, accessories, taxes, installation, warranty and exclusions line by line. The lowest total may not be the best value.", "compare quotations specifications"],
    ["Which plywood is best for home interiors?", "Choose a suitable certified grade from a reputable manufacturer based on moisture exposure and use. Edge sealing, correct thickness and proper installation are as important as the board.", "best plywood interiors"],
    ["What is the difference between IS 710 and IS 303 plywood?", "IS 710 is commonly associated with boiling-water-proof plywood, while IS 303 refers to moisture-resistant plywood. Verify labels and certification, not just verbal claims.", "IS 710 IS 303 plywood"],
    ["Is BWP plywood better than regular plywood?", "BWP plywood is more moisture resistant and is often suited to kitchens and utility zones. It still requires sealed edges, sound detailing and protection from leaks.", "BWP plywood kitchen"],
    ["What is the difference between plywood, MDF, HDHMR and particle board?", "Plywood is strong and holds screws well; MDF is smooth for routed finishes; HDHMR is denser and more moisture resistant; particle board is economical but less robust.", "plywood MDF HDHMR particle board"],
    ["Which material is best for kitchen cabinets?", "Good-quality moisture-resistant plywood with sealed edges is a dependable carcass choice for many kitchens. Ventilation, water exposure, hardware and workmanship remain equally important.", "kitchen cabinet material"],
    ["Which material is best for wardrobes?", "Plywood is durable for wardrobes; MDF or HDHMR can suit painted or routed designs in dry spaces. Match the material to door weight, finish, budget and humidity.", "wardrobe material"],
    ["What is the difference between laminate, acrylic and veneer?", "Laminate is durable and practical, acrylic is sleek and reflective, and veneer provides natural wood character. Select by appearance, maintenance, wear resistance and budget.", "laminate acrylic veneer"],
    ["Is acrylic better than laminate?", "Neither is universally better. Acrylic has a premium glossy look but needs careful upkeep; laminate is versatile, forgiving and often more cost-effective.", "acrylic laminate comparison"],
    ["What is the difference between matte and glossy laminate?", "Matte finishes feel understated and hide fingerprints better; glossy finishes reflect light and can brighten compact rooms, but show smudges more easily.", "matte glossy laminate"],
    ["How do I know whether the material used is the same as promised?", "Use a signed specification sheet naming brand, grade, thickness, finish and hardware. Check labels and samples at delivery or before fabrication, and record approvals.", "verify materials specifications"],
    ["Can I inspect material samples before approving the work?", "Yes—and you should. Inspect samples in the room's lighting, review the final combination, and document approval before procurement or manufacturing begins.", "material samples approval"],
    ["Should material brands and specifications be mentioned in the agreement?", "Yes. Specify grade, thickness, finish, hardware brand or equivalent standard, plus the process if an item becomes unavailable. 'Premium quality' is not a measurable specification.", "materials agreement specifications"],
    ["What is a material approval sheet?", "It is a written record of approved samples, brands, codes, thicknesses and locations of use. It guides procurement, fabrication and final quality checks.", "material approval sheet"],
    ["How can I prevent low-quality materials from being used?", "Use itemised specifications, approve samples, verify deliveries and review work at important milestones. Checking only after installation limits the options for correction.", "quality control materials"],
    ["What warranty is available for interior work?", "Warranty differs for workmanship, boards, finishes and branded hardware. Ask for duration, exclusions, maintenance requirements and the service-request process in writing.", "interior warranty workmanship hardware"],
    ["What is turnkey interior execution?", "Turnkey execution means one team manages design, procurement, fabrication, site coordination, installation and handover. The agreement must still define scope, milestones, variations and quality checks.", "turnkey execution interiors"],
    ["Is civil work included in interior design?", "Not automatically. Demolition, masonry, tiling, waterproofing and structural changes should be separately listed, with technical responsibility and required approvals clarified first.", "civil work interior scope"],
    ["Are electrical, plumbing and painting included?", "They may be included in a turnkey scope, but must be listed separately with quantities and specifications. Confirm fixtures, wiring, fittings, preparation and paint coats.", "electrical plumbing painting scope"],
    ["Are appliances included in the interior quotation?", "Often they are excluded unless specifically listed. Confirm the model, supply responsibility, installation scope, warranty ownership and cabinet dimensions around each appliance.", "appliances quotation scope"],
    ["Are lights and accessories included in the interior package?", "Decorative lights, loose accessories and soft furnishings are often separate selections. Ask for a room-wise list showing design, supply and installation responsibility.", "lights accessories scope"],
    ["Why does the final interior cost increase?", "Costs rise when scope expands, specifications upgrade, site conditions require extra work or quantities change. Every variation should show its reason, cost and time impact before approval.", "cost increase variations"],
    ["What is a change order in interior work?", "A change order is written approval for work that differs from the original scope. It records the change, price impact, timeline impact and authorisation before execution.", "change order interiors"],
    ["Can additional work be done without changing the quotation?", "It should not be. Approve a written variation first so materials, labour, cost, timing and responsibility are clear to everyone.", "additional work variation"],
    ["How are extra works charged?", "Extra work may use an agreed rate card, measurement basis or separate quotation. Confirm the price, tax, material specification and payment timing before authorising it.", "extra work charges"],
    ["Should I pay the full amount in advance for interiors?", "A full advance is generally unsuitable for a staged project. Link payments to verifiable milestones such as design approval, procurement, factory completion, installation and handover.", "advance payment milestones"],
    ["What is the safest payment schedule for interior work?", "Use milestone-based payments tied to actual progress and retain a reasonable final amount until snag items and handover documents are completed. Keep invoices and receipts.", "safe payment schedule"],
    ["What happens if the project is delayed?", "The agreement should set the programme, communication process, excusable delays and remedies. Written progress updates and early escalation of material or site issues protect the schedule.", "project delay agreement"],
    ["Who is responsible for damage during execution?", "The contract should define protection of existing finishes, common areas and supplied materials. Photograph the site before work begins and report any incident immediately.", "damage execution responsibility"],
    ["How are defects and repair requests handled?", "Record defects in a written snag list with photos, responsibility and target dates. Use one service channel and retain workmanship and product warranty documents.", "defects repairs snag list"],
    ["What should I check before taking handover of my interiors?", "Check measurements, alignment, finish quality, edge banding, door and drawer operation, hardware, electrical points, paint touch-ups, cleanliness and agreed accessories; collect all warranty records.", "interior handover checklist"]
  ].map(([question, answer, keywords], index) => ({
    id: `faq-interior-guide-${index + 1}`,
    category: "interiors",
    question,
    answer,
    keywords
  }));

  FAQ_DATABASE.splice(7, 0, ...INTERIOR_FAQ_ADDITIONS);

  const EXPANDED_FAQS = [
    ["construction", "How much does it cost to construct a house in Hyderabad?", "House cost depends on approved built-up area, structural system, soil condition, specifications, elevation, services and finish level. Use a detailed scope and bill of quantities, not a single headline rate."],
    ["construction", "What is the construction cost per square foot in Hyderabad?", "A per-square-foot figure is only an early budgeting guide. Compare quotations only after confirming whether the same built-up area, materials, services, taxes and exclusions are included."],
    ["construction", "What is the process of constructing a house?", "The process is site study, design, approvals, structural drawings, specifications, contract, procurement, stage-wise construction, inspections and documented handover."],
    ["construction", "Do I need structural drawings for house construction?", "Yes. A qualified structural engineer should design the foundation and RCC system from the architectural plan and site conditions before structural work begins."],
    ["construction", "What permissions are required for house construction?", "Requirements depend on the local authority, plot and proposal. Confirm sanctioned plans, applicable permissions and utility requirements with a qualified local professional before starting."],
    ["construction", "What is the difference between labour contract and turnkey construction?", "In a labour contract the owner usually procures materials; turnkey construction places material procurement and execution with one contractor. Compare accountability, specifications and risk—not only price."],
    ["construction", "How should construction payments be divided into milestones?", "Link payments to verifiable progress such as foundation, structure, masonry, plaster, finishes and handover. Each stage should be measured and invoiced before payment."],
    ["construction", "What should be included in a house construction agreement?", "Include drawings, specifications, contract value, payment stages, timeline, exclusions, variation process, quality standards, defect responsibility and dispute terms."],
    ["construction", "How is construction quality checked?", "Quality is controlled through approved drawings, material checks, stage inspections, measurement records and documented approvals before work is covered or the next stage begins."],
    ["construction", "What should be checked before house handover?", "Check finishes, doors, windows, services, waterproofing, drainage, pending defects and all agreed documents. Record remaining items in a signed snag list."],
    ["furniture", "What is custom furniture?", "Custom furniture is designed and manufactured for your exact room, use, dimensions and finish preferences, rather than selected from fixed ready-made sizes."],
    ["furniture", "How much does custom furniture cost?", "Cost depends on dimensions, board and finish selection, hardware, design complexity, quantity, transport and installation. An itemised specification makes comparison meaningful."],
    ["furniture", "How long does custom furniture take to manufacture?", "Time depends on design approval, material availability, factory capacity, finishing and installation readiness. Confirm a production and installation schedule after final measurement."],
    ["furniture", "Can furniture be made according to my room size?", "Yes. Site measurement is the foundation of custom work; final manufacturing dimensions should be approved only after wall conditions, flooring and services are verified."],
    ["furniture", "Can I approve the design before manufacturing?", "Yes. Approve drawings, dimensions, materials, hardware and finish samples in writing before production. This is the key control point for avoiding avoidable rework."],
    ["furniture", "Is machine-made furniture more accurate?", "Machine-made components are generally more consistent in cutting and edge finishing, but final quality still depends on design detailing, materials, assembly and installation."],
    ["furniture", "What should I check before accepting the furniture?", "Check dimensions, alignment, finish, edge banding, hardware movement, wall fixing, cleanliness and accessories. Record defects or pending items in writing before final acceptance."],
    ["real-estate", "What should I check before buying a plot?", "Verify title, link documents, encumbrances, layout approval, access, boundaries, tax records and local development restrictions. Use an independent property lawyer before paying an advance."],
    ["real-estate", "How do I verify land ownership?", "Review the title chain, seller identity, revenue records, encumbrance details and survey information through a qualified property lawyer; do not rely only on copies supplied by the seller."],
    ["real-estate", "What is RERA and why is it important?", "RERA registration places key project details, approvals and timelines on the state regulator's record. It is a useful check, but it does not replace independent legal due diligence."],
    ["real-estate", "Is buying land a good investment?", "It can be, but suitability depends on legal clarity, access, infrastructure, holding period, development potential and your risk tolerance. Assess the specific parcel, not just the area narrative."],
    ["real-estate", "What is rental yield?", "Rental yield is the annual rent expressed as a percentage of the property cost. Compare net yield after maintenance, vacancy, taxes and financing costs—not gross rent alone."],
    ["real-estate", "What are the hidden costs when buying property?", "Budget for stamp duty, registration, legal review, loan charges, association deposits, maintenance, utilities, fit-out and any applicable taxes alongside the agreed price."],
    ["real-estate", "Should I consult a property lawyer before buying?", "Yes. An independent lawyer can verify title, approvals, encumbrances, agreement terms and registration requirements before you commit funds."]
  ].map(([category, question, answer], index) => ({ id: `faq-expanded-${index + 1}`, category, question, answer, keywords: `${category} ${question}` }));

  FAQ_DATABASE.push(...EXPANDED_FAQS);

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getFilteredFaqs() {
    const term = state.searchTerm.trim().toLowerCase();

    return FAQ_DATABASE.filter((faq) => {
      const matchesCategory =
        state.activeCategory === "all" ||
        faq.category === state.activeCategory;

      if (!matchesCategory) return false;
      if (!term) return true;

      const searchable = [
        faq.question,
        faq.answer,
        faq.category,
        faq.keywords || ""
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(term);
    });
  }

  function renderCategoryCounts() {
    const counts = FAQ_DATABASE.reduce((result, faq) => {
      result[faq.category] = (result[faq.category] || 0) + 1;
      return result;
    }, {});

    const countFor = (category) =>
      category === "all" ? FAQ_DATABASE.length : counts[category] || 0;

    $$("[data-category-count]").forEach((element) => {
      element.textContent = `${countFor(element.dataset.categoryCount)} Questions`;
    });

    $$("[data-filter-count]").forEach((element) => {
      element.textContent = `(${countFor(element.dataset.filterCount)})`;
    });

    const total = $("[data-total-questions]");
    if (total) total.textContent = `${FAQ_DATABASE.length} Questions`;
  }

  function renderFaqList() {
    const list =
      $("#faqList") ||
      $(".faq-list") ||
      $("[data-faq-list]");

    if (!list) return;

    const filtered = getFilteredFaqs();
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));

    if (state.currentPage > totalPages) {
      state.currentPage = totalPages;
    }

    const start = (state.currentPage - 1) * state.perPage;
    const visible = filtered.slice(start, start + state.perPage);

    if (!visible.length) {
      list.innerHTML = `
        <div class="faq-empty">
          <h3>No questions found</h3>
          <p>Try another keyword or choose a different category.</p>
        </div>
      `;
    } else {
      list.innerHTML = visible
        .map(
          (faq) => `
            <article class="faq-item${state.openFaqId === faq.id ? " open" : ""}" id="${escapeHtml(faq.id)}">
              <button class="faq-question" type="button" aria-expanded="${
                state.openFaqId === faq.id ? "true" : "false"
              }" aria-controls="${escapeHtml(faq.id)}-answer" data-faq-toggle="${escapeHtml(faq.id)}">
                <span class="faq-question-text">${escapeHtml(faq.question)}</span>
                <span class="faq-question-icon" aria-hidden="true">+</span>
              </button>
              <div class="faq-answer" id="${escapeHtml(faq.id)}-answer" ${
                state.openFaqId === faq.id ? "" : "hidden"
              }>
                <p>${escapeHtml(faq.answer)}</p>
              </div>
            </article>
          `
        )
        .join("");
    }

    const resultCount = $("#faqResultCount");
    if (resultCount) {
      resultCount.textContent =
        filtered.length === 1
          ? "Showing 1 Question"
          : `Showing ${filtered.length} Questions`;
    }

    renderPagination(filtered.length, totalPages);
  }

  function renderPagination(totalItems, totalPages) {
    const pagination =
      $("#faqPagination") ||
      $(".faq-pagination") ||
      $("[data-faq-pagination]");

    if (!pagination) return;

    if (totalItems <= state.perPage) {
      pagination.innerHTML = "";
      return;
    }

    const buttons = [];

    buttons.push(`
      <button type="button" class="faq-page-button" data-page="${
        state.currentPage - 1
      }" ${state.currentPage === 1 ? "disabled" : ""} aria-label="Previous page">
        Previous
      </button>
    `);

    for (let page = 1; page <= totalPages; page += 1) {
      buttons.push(`
        <button type="button" class="faq-page-button${
          page === state.currentPage ? " is-active" : ""
        }" data-page="${page}" ${
          page === state.currentPage ? 'aria-current="page"' : ""
        }>
          ${page}
        </button>
      `);
    }

    buttons.push(`
      <button type="button" class="faq-page-button" data-page="${
        state.currentPage + 1
      }" ${state.currentPage === totalPages ? "disabled" : ""} aria-label="Next page">
        Next
      </button>
    `);

    pagination.innerHTML = buttons.join("");
  }

  function setCategory(category) {
    state.activeCategory = category || "all";
    state.currentPage = 1;
    state.openFaqId = null;

    $$("[data-category]").forEach((button) => {
      const active = button.dataset.category === state.activeCategory;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    renderFaqList();
  }

  function setSearch(term) {
    state.searchTerm = term;
    state.currentPage = 1;
    state.openFaqId = null;
    renderFaqList();
  }

  function handleFaqToggle(id) {
    state.openFaqId = state.openFaqId === id ? null : id;
    renderFaqList();
  }

  function initSearch() {
    const form =
      $("#faqSearchForm") ||
      $(".faq-search-form") ||
      $("[data-faq-search-form]");

    const input =
      $("#faqSearchInput") ||
      $(".faq-search-input") ||
      $("[data-faq-search]");

    if (!input) return;

    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        setSearch(input.value);
      });
    }

    input.addEventListener("input", () => {
      setSearch(input.value);
    });

    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    const category = params.get("category");

    if (query) {
      input.value = query;
      state.searchTerm = query;
    }

    if (category && (category === "all" || categoryLabels[category])) {
      state.activeCategory = category;
    }
  }

  function initCategoryFilters() {
    $$("[data-category]").forEach((button) => {
      button.addEventListener("click", () => {
        setCategory(button.dataset.category);

        if (button.closest("#faqCategoryGrid")) {
          const target = $("#allQuestions");
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function initDirectoryEvents() {
    const list =
      $("#faqList") ||
      $(".faq-list") ||
      $("[data-faq-list]");

    if (list) {
      list.addEventListener("click", (event) => {
        const toggle = event.target.closest("[data-faq-toggle]");
        if (!toggle) return;
        handleFaqToggle(toggle.dataset.faqToggle);
      });
    }

    const pagination =
      $("#faqPagination") ||
      $(".faq-pagination") ||
      $("[data-faq-pagination]");

    if (pagination) {
      pagination.addEventListener("click", (event) => {
        const button = event.target.closest("[data-page]");
        if (!button || button.disabled) return;

        const page = Number(button.dataset.page);
        if (!Number.isFinite(page) || page < 1) return;

        state.currentPage = page;
        state.openFaqId = null;
        renderFaqList();
      });
    }
  }

  function initFeaturedLinks() {
    $$("[data-faq-link], .faq-featured-card a[href^=\"#\"]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const faqId = link.dataset.faqLink || link.getAttribute("href")?.replace(/^#/, "");
        const faq = FAQ_DATABASE.find((item) => item.id === faqId);
        if (!faq) return;

        event.preventDefault();
        state.activeCategory = faq.category;
        state.searchTerm = "";
        state.currentPage = 1;
        state.openFaqId = faq.id;

        const input =
          $("#faqSearchInput") ||
          $(".faq-search-input") ||
          $("[data-faq-search]");

        if (input) input.value = "";

        setCategory(faq.category);

        window.requestAnimationFrame(() => {
          const target = document.getElementById(faq.id);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    });
  }

  function initClearSearch() {
    const input = $("#faqSearchInput");
    const clearButton = $("#clearSearchButton");

    if (!input || !clearButton) return;

    const updateClearState = () => {
      clearButton.hidden = !input.value;
    };

    input.addEventListener("input", updateClearState);
    clearButton.addEventListener("click", () => {
      input.value = "";
      setSearch("");
      updateClearState();
      input.focus();
    });

    updateClearState();
  }

  function initMobileMenu() {
    const menuButton =
      $("#hamburgerBtn") ||
      $(".menu-toggle") ||
      $(".hamburger") ||
      $("[data-menu-toggle]");

    const drawer =
      $("#mobileDrawer") ||
      $(".mobile-drawer") ||
      $(".mobile-menu") ||
      $("[data-mobile-menu]");

    if (!menuButton || !drawer) return;

    const closeButton = $("#closeDrawer") || $(".close-drawer");

    const setMenuState = (isOpen) => {
      drawer.classList.toggle("is-open", isOpen);
      menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      drawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
    };

    menuButton.addEventListener("click", () => {
      setMenuState(!drawer.classList.contains("is-open"));
    });

    if (closeButton) {
      closeButton.addEventListener("click", () => setMenuState(false));
    }

    $$(".drawer-link", drawer).forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuState(false);
    });
  }

  function initHeaderScroll() {
    const header = $("#siteHeader");
    if (!header) return;

    const updateHeader = () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  function init() {
    renderCategoryCounts();
    initSearch();
    initClearSearch();
    initCategoryFilters();
    initDirectoryEvents();
    initFeaturedLinks();
    initMobileMenu();
    initHeaderScroll();

    $$("[data-category]").forEach((button) => {
      const active = button.dataset.category === state.activeCategory;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    renderFaqList();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
