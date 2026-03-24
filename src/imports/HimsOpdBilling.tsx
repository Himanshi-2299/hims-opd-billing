import clsx from "clsx";
import svgPaths from "./svg-92j9ilcwbs";
type ButtonProps = {
  additionalClassNames?: string;
  text: string;
};

function Button({ children, additionalClassNames = "", text }: React.PropsWithChildren<ButtonProps>) {
  return (
    <div className={clsx("bg-white h-[36px] min-h-px min-w-px relative rounded-[6px]", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16.8px] py-[8.8px] relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#020617] text-[14px] text-center whitespace-nowrap">{text}</p>
        </div>
      </div>
    </div>
  );
}
type Wrapper4Props = {
  additionalClassNames?: string;
};

function Wrapper4({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper4Props>) {
  return (
    <div className={additionalClassNames}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type Wrapper3Props = {
  additionalClassNames?: string;
};

function Wrapper3({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper3Props>) {
  return <Wrapper4 additionalClassNames={clsx("flex-[1_0_0] min-h-px min-w-px relative", additionalClassNames)}>{children}</Wrapper4>;
}
type Wrapper2Props = {
  additionalClassNames?: string;
};

function Wrapper2({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper2Props>) {
  return <Wrapper4 additionalClassNames={clsx("relative shrink-0", additionalClassNames)}>{children}</Wrapper4>;
}
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div className={clsx("size-[16px]", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        {children}
      </svg>
    </div>
  );
}
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={clsx("bg-white relative rounded-[6px] shrink-0 w-full", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center size-full">{children}</div>
    </div>
  );
}

function RegisterPatientPage({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper additionalClassNames="h-[69.6px]">
      <div className="content-stretch flex items-center justify-between px-[16.8px] py-[0.8px] relative size-full">{children}</div>
    </Wrapper>
  );
}

function PrimitiveButton({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper additionalClassNames="h-[36px]">
      <div className="content-stretch flex items-center justify-between px-[12.8px] py-[0.8px] relative size-full">{children}</div>
    </Wrapper>
  );
}
type Icon1Props = {
  additionalClassNames?: string;
};

function Icon1({ children, additionalClassNames = "" }: React.PropsWithChildren<Icon1Props>) {
  return (
    <Wrapper1 additionalClassNames={additionalClassNames}>
      <g id="Icon">{children}</g>
    </Wrapper1>
  );
}
type Icon13VectorProps = {
  additionalClassNames?: string;
};

function Icon13Vector({ additionalClassNames = "" }: Icon13VectorProps) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <div className="absolute inset-[-100.03%_-250.07%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.60035 2.00035">
          <path d={svgPaths.p3c73800} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </svg>
      </div>
    </div>
  );
}
type TextText1Props = {
  text: string;
};

function TextText1({ text }: TextText1Props) {
  return (
    <Wrapper2 additionalClassNames="h-[36px] w-[13.2px]">
      <p className="absolute font-['Consolas:Bold',sans-serif] leading-[36px] left-0 not-italic text-[#020617] text-[24px] top-[-0.8px] whitespace-nowrap">{text}</p>
    </Wrapper2>
  );
}
type TextTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TextText({ text, additionalClassNames = "" }: TextTextProps) {
  return (
    <Wrapper4 additionalClassNames={clsx("h-[21px] relative shrink-0", additionalClassNames)}>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#64748b] text-[14px] top-[-0.4px] whitespace-nowrap">{text}</p>
    </Wrapper4>
  );
}

function Icon() {
  return (
    <Wrapper1 additionalClassNames="relative shrink-0">
      <g id="Icon" opacity="0.5">
        <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
      </g>
    </Wrapper1>
  );
}
type PrimitiveSpanTextProps = {
  text: string;
  additionalClassNames?: string;
};

function PrimitiveSpanText({ text, additionalClassNames = "" }: PrimitiveSpanTextProps) {
  return (
    <div className={clsx("h-[20px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#64748b] text-[14px] text-center whitespace-nowrap">{text}</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[36px] relative rounded-[6px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}
type PrimitiveLabelTextProps = {
  text: string;
};

function PrimitiveLabelText({ text }: PrimitiveLabelTextProps) {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#020617] text-[14px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type HeadingTextProps = {
  text: string;
};

function HeadingText({ text }: HeadingTextProps) {
  return (
    <div className="h-[21px] relative shrink-0 w-full">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#64748b] text-[14px] top-[-0.4px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type Text2Props = {
  text: string;
};

function Text2({ text }: Text2Props) {
  return (
    <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
      <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
        <p className="font-['Consolas:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">{text}</p>
      </div>
    </div>
  );
}
type InputTextProps = {
  text: string;
};

function InputText({ text }: InputTextProps) {
  return (
    <div className="bg-white h-[36px] relative rounded-[6px] shrink-0 w-full">
      <Text2 text={text} />
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}
type RegisterPatientPageTextProps = {
  text: string;
  additionalClassNames?: string;
};

function RegisterPatientPageText({ text, additionalClassNames = "" }: RegisterPatientPageTextProps) {
  return (
    <div className={clsx("absolute h-[14px] top-0 w-[7.313px]", additionalClassNames)}>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[14px] left-0 not-italic text-[#dc2626] text-[14px] top-[0.4px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type Text1Props = {
  text: string;
};

function Text1({ text }: Text1Props) {
  return (
    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#f8fafc] text-[14px] text-center whitespace-nowrap">{text}</p>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">{text}</p>
    </div>
  );
}

export default function HimsOpdBilling() {
  return (
    <div className="bg-white relative size-full" data-name="hims OPD Billing">
      <div className="absolute bg-white content-stretch flex h-[729.6px] items-start left-0 top-0 w-[1166.4px]" data-name="SidebarProvider">
        <Wrapper3 additionalClassNames="h-[729.6px]">
          <div className="absolute h-[729.6px] left-0 top-0 w-[48px]" data-name="Sidebar" />
          <div className="absolute bg-white content-stretch flex flex-col gap-[0.8px] h-[729.6px] items-start left-[48px] overflow-clip top-0 w-[1118.4px]" data-name="SidebarInset">
            <div className="bg-white h-[40px] relative shrink-0 w-[1118.4px]" data-name="GlobalHeader">
              <div aria-hidden="true" className="absolute border-b-[0.8px] border-black border-solid inset-0 pointer-events-none" />
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center pb-[0.8px] pl-[12px] pr-[16px] relative size-full">
                <div className="relative rounded-[6px] shrink-0 size-[28px]" data-name="Button">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[6px] relative size-full">
                    <Icon1 additionalClassNames="relative shrink-0">
                      <path d={svgPaths.p19d57600} id="Vector" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d="M6 2V14" id="Vector_2" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    </Icon1>
                  </div>
                </div>
                <div className="bg-[#e2e8f0] h-[40px] shrink-0 w-px" data-name="Primitive.div" />
                <div className="flex-[501.975_0_0] h-[20px] min-h-px min-w-px relative" data-name="Container">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
                    <Wrapper2 additionalClassNames="h-[20px] w-[192.512px]">
                      <div className="absolute content-stretch flex h-[20px] items-center left-0 top-0 w-[53.362px]" data-name="BreadcrumbItem">
                        <Wrapper3 additionalClassNames="h-[20px]">
                          <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] top-[0.6px] whitespace-nowrap">Masters</p>
                        </Wrapper3>
                      </div>
                      <div className="absolute left-[63.36px] size-[14px] top-[3px]" data-name="BreadcrumbSeparator">
                        <div className="absolute left-0 size-[14px] top-0" data-name="Icon">
                          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                            <g id="Icon">
                              <path d="M5.25 10.5L8.75 7L5.25 3.5" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                            </g>
                          </svg>
                        </div>
                      </div>
                      <div className="absolute content-stretch flex h-[20px] items-center left-[87.36px] top-0 w-[105.15px]" data-name="BreadcrumbItem">
                        <Wrapper3 additionalClassNames="h-[20px]">
                          <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#020617] text-[14px] top-[0.6px] whitespace-nowrap">Register Patient</p>
                        </Wrapper3>
                      </div>
                    </Wrapper2>
                  </div>
                </div>
                <Wrapper2 additionalClassNames="h-[36px] w-[511.425px]">
                  <div className="absolute bg-[#e2e8f0] h-0 left-[264px] top-[18px] w-px" data-name="Primitive.div" />
                  <div className="absolute bg-[#e2e8f0] h-0 left-[317px] top-[18px] w-px" data-name="Primitive.div" />
                  <div className="absolute content-stretch flex items-center justify-center left-[326px] px-[10px] rounded-[6px] size-[36px] top-0" data-name="Button">
                    <Wrapper1 additionalClassNames="relative shrink-0">
                      <g clipPath="url(#clip0_4009_895)" id="Icon">
                        <path d={svgPaths.p3adb3b00} id="Vector" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d="M8 1.33333V2.66667" id="Vector_2" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d="M8 13.3333V14.6667" id="Vector_3" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d={svgPaths.p11bc9dc0} id="Vector_4" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d={svgPaths.p191ca260} id="Vector_5" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d="M1.33333 8H2.66667" id="Vector_6" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d="M13.3333 8H14.6667" id="Vector_7" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d={svgPaths.pe73b76f} id="Vector_8" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d={svgPaths.p1df25380} id="Vector_9" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      </g>
                      <defs>
                        <clipPath id="clip0_4009_895">
                          <rect fill="white" height="16" width="16" />
                        </clipPath>
                      </defs>
                    </Wrapper1>
                  </div>
                  <div className="absolute bg-[#e2e8f0] h-0 left-[370px] top-[18px] w-px" data-name="Primitive.div" />
                  <div className="absolute content-stretch flex items-center justify-center left-[379px] px-[10px] rounded-[6px] size-[36px] top-0" data-name="Button">
                    <Icon1 additionalClassNames="relative shrink-0">
                      <path d={svgPaths.p2338cf00} id="Vector" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    </Icon1>
                  </div>
                  <div className="absolute bg-[#e2e8f0] h-0 left-[423px] top-[18px] w-px" data-name="Primitive.div" />
                  <div className="absolute content-stretch flex h-[36px] items-center justify-center left-[432px] px-[8px] rounded-[6px] top-0 w-[79.425px]" data-name="Button">
                    <Wrapper2 additionalClassNames="h-[20px] w-[63.425px]">
                      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[32px] not-italic text-[#020617] text-[14px] text-center top-[0.6px] whitespace-nowrap">John Doe</p>
                    </Wrapper2>
                  </div>
                  <div className="absolute h-[32px] left-0 top-[2px] w-[256px]" data-name="Container">
                    <div className="absolute bg-white h-[32px] left-0 rounded-[6px] top-0 w-[256px]" data-name="Input">
                      <div className="content-stretch flex items-center overflow-clip pl-[36px] pr-[48px] py-[4px] relative rounded-[inherit] size-full">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Search...</p>
                      </div>
                      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
                    </div>
                    <Icon1 additionalClassNames="absolute left-[12px] top-[8px]">
                      <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d="M14 14L11.1333 11.1333" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    </Icon1>
                    <div className="absolute bg-[#f1f5f9] border-[#e2e8f0] border-[0.8px] border-solid h-[20px] left-[208.1px] rounded-[4px] top-[6px] w-[35.9px]" data-name="Kbd">
                      <div className="absolute content-stretch flex h-[15.988px] items-start left-[6px] top-[1.2px] w-[12.8px]" data-name="Text">
                        <p className="flex-[1_0_0] font-['Consolas:Regular','Noto_Sans_Symbols2:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#64748b] text-[12px]">⌘</p>
                      </div>
                      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[15px] left-[22.8px] not-italic text-[#64748b] text-[10px] top-[1.3px] whitespace-nowrap">/</p>
                    </div>
                  </div>
                  <div className="absolute left-[273px] rounded-[6px] size-[36px] top-0" data-name="Button">
                    <Icon1 additionalClassNames="absolute left-[10px] top-[10px]">
                      <path d={svgPaths.p1ce3c700} id="Vector" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d={svgPaths.p1a06de00} id="Vector_2" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    </Icon1>
                    <div className="absolute bg-[#dc2626] left-[24px] rounded-[26843500px] size-[16px] top-[-4px]" data-name="Badge">
                      <div className="content-stretch flex items-center justify-center overflow-clip p-[0.8px] relative rounded-[inherit] size-full">
                        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[14.286px] not-italic relative shrink-0 text-[10px] text-center text-white whitespace-nowrap">1</p>
                      </div>
                      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[26843500px]" />
                    </div>
                  </div>
                </Wrapper2>
              </div>
            </div>
            <div className="flex-[652_0_0] min-h-px min-w-px relative w-[1118.4px]" data-name="AppShell">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-[15.2px] relative rounded-[inherit] size-full">
                <div className="h-[885px] relative shrink-0 w-full" data-name="RegisterPatientPage">
                  <div className="content-stretch flex flex-col gap-[24px] items-start pl-[24px] pt-[24px] relative size-full">
                    <div className="h-[36px] relative shrink-0 w-[1055.2px]" data-name="Container">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
                        <div className="h-[32px] relative shrink-0 w-[165.4px]" data-name="Container">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
                            <div className="relative rounded-[6px] shrink-0 size-[32px]" data-name="Button">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[8px] relative size-full">
                                <Icon1 additionalClassNames="relative shrink-0">
                                  <path d="M10 12L6 8L10 4" id="Vector" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                                </Icon1>
                              </div>
                            </div>
                            <Wrapper2 additionalClassNames="h-[30px] w-[117.4px]">
                              <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[#020617] text-[20px] top-[-0.6px] whitespace-nowrap">Registration</p>
                            </Wrapper2>
                          </div>
                        </div>
                        <div className="h-[36px] relative shrink-0 w-[187.088px]" data-name="Container">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
                            <div className="bg-white h-[36px] relative rounded-[6px] shrink-0 w-[68.963px]" data-name="Button">
                              <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16.8px] py-[8.8px] relative size-full">
                                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#020617] text-[14px] text-center whitespace-nowrap">{"Clear"}</p>
                              </div>
                            </div>
                            <div className="bg-[#0e7490] h-[36px] opacity-50 relative rounded-[6px] shrink-0 w-[110.125px]" data-name="Button">
                              <Text1 text="Create Visit" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h-[777px] relative shrink-0 w-[1055.2px]" data-name="Container">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-start relative size-full">
                        <div className="flex-[686.2_0_0] h-[777px] min-h-px min-w-px relative" data-name="Container">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative size-full">
                            <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
                              <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-0 top-0 w-[220.725px]" data-name="Container">
                                <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
                                  <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[14px] left-0 not-italic text-[#020617] text-[14px] top-[0.4px] whitespace-nowrap">{`Phone Number `}</p>
                                  <RegisterPatientPageText text="*" additionalClassNames="left-[107.61px]" />
                                </div>
                                <InputText text="Enter 10-digit number" />
                              </div>
                              <div className="absolute content-stretch flex gap-[8px] h-[58px] items-end left-[232.73px] pr-[-24.337px] top-0 w-[220.738px]" data-name="Container">
                                <Button additionalClassNames="flex-[121.4_0_0]" text="Create ABHA" />
                                <Button additionalClassNames="flex-[115.675_0_0]" text="Verify ABHA" />
                              </div>
                            </div>
                            <div className="content-stretch flex flex-col gap-[16px] h-[502px] items-start relative shrink-0 w-full" data-name="Container">
                              <HeadingText text="Patient Details" />
                              <div className="content-stretch flex flex-col gap-[16px] h-[465px] items-start relative shrink-0 w-full" data-name="Container">
                                <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
                                  <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-0 top-0 w-[218.063px]" data-name="Container">
                                    <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
                                      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[14px] left-0 not-italic text-[#020617] text-[14px] top-[0.4px] whitespace-nowrap">{`First Name `}</p>
                                      <RegisterPatientPageText text="*" additionalClassNames="left-[80.51px]" />
                                    </div>
                                    <div className="bg-white h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Input">
                                      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                                        <Text text="Enter First Name" />
                                      </div>
                                      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
                                    </div>
                                  </div>
                                  <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-[234.06px] top-0 w-[218.063px]" data-name="Container">
                                    <PrimitiveLabelText text="Middle Name" />
                                    <Input />
                                  </div>
                                  <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-[468.13px] top-0 w-[218.075px]" data-name="Container">
                                    <PrimitiveLabelText text="Last Name" />
                                    <div className="bg-white h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Input">
                                      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                                        <Text text="Enter Last Name" />
                                      </div>
                                      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
                                    </div>
                                  </div>
                                </div>
                                <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
                                  <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-0 top-0 w-[335.1px]" data-name="Container">
                                    <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
                                      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[14px] left-0 not-italic text-[#020617] text-[14px] top-[0.4px] whitespace-nowrap">{`Gender `}</p>
                                      <RegisterPatientPageText text="*" additionalClassNames="left-[57.44px]" />
                                    </div>
                                    <div className="content-stretch flex gap-[8px] h-[36px] items-start relative shrink-0 w-full" data-name="Container">
                                      <div className="bg-[#0e7490] flex-[105.3_0_0] h-[36px] min-h-px min-w-px relative rounded-[6px]" data-name="Button">
                                        <div className="flex flex-row items-center justify-center size-full">
                                          <Text1 text="Male" />
                                        </div>
                                      </div>
                                      <Button additionalClassNames="flex-[106.9_0_0]" text="Female" />
                                      <Button additionalClassNames="flex-[106.9_0_0]" text="Other" />
                                    </div>
                                  </div>
                                  <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-[351.1px] top-0 w-[335.1px]" data-name="Container">
                                    <PrimitiveLabelText text="Date of Birth" />
                                    <div className="bg-white h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
                                      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
                                      <div className="absolute h-[20px] left-[12.8px] top-[8px] w-[97.963px]" data-name="RegisterPatientPage">
                                        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] top-[0.6px] whitespace-nowrap">dd-mmm-yyyy</p>
                                      </div>
                                      <Icon1 additionalClassNames="absolute left-[306.3px] top-[10px]">
                                        <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                                        <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                                        <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                                        <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                                      </Icon1>
                                    </div>
                                  </div>
                                </div>
                                <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
                                  <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-0 top-0 w-[218.063px]" data-name="Container">
                                    <PrimitiveLabelText text="Years" />
                                    <div className="bg-[#f1f5f9] h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Input">
                                      <Text2 text="0-125" />
                                      <div aria-hidden="true" className="absolute border-[0.8px] border-solid border-white inset-0 pointer-events-none rounded-[6px]" />
                                    </div>
                                  </div>
                                  <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-[234.06px] top-0 w-[218.063px]" data-name="Container">
                                    <PrimitiveLabelText text="Months" />
                                    <div className="bg-[#f1f5f9] h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Input">
                                      <Text2 text="0-11" />
                                      <div aria-hidden="true" className="absolute border-[0.8px] border-solid border-white inset-0 pointer-events-none rounded-[6px]" />
                                    </div>
                                  </div>
                                  <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-[468.13px] top-0 w-[218.075px]" data-name="Container">
                                    <PrimitiveLabelText text="Days" />
                                    <div className="bg-[#f1f5f9] h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Input">
                                      <Text2 text="0-30" />
                                      <div aria-hidden="true" className="absolute border-[0.8px] border-solid border-white inset-0 pointer-events-none rounded-[6px]" />
                                    </div>
                                  </div>
                                </div>
                                <div className="content-stretch flex flex-col gap-[16px] h-[243px] items-start relative shrink-0 w-full" data-name="Container">
                                  <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
                                    <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#64748b] text-[14px] top-[-0.4px] whitespace-nowrap">Address</p>
                                  </div>
                                  <div className="content-stretch flex flex-col gap-[8px] h-[58px] items-start relative shrink-0 w-full" data-name="Container">
                                    <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
                                      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[14px] left-0 not-italic text-[#020617] text-[14px] top-[0.4px] whitespace-nowrap">{`Address Line 1 `}</p>
                                      <RegisterPatientPageText text="*" additionalClassNames="left-[105.54px]" />
                                    </div>
                                    <Input />
                                  </div>
                                  <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
                                    <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-0 top-0 w-[335.1px]" data-name="Container">
                                      <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
                                        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[14px] left-0 not-italic text-[#020617] text-[14px] top-[0.4px] whitespace-nowrap">{`District `}</p>
                                        <RegisterPatientPageText text="*" additionalClassNames="left-[56.32px]" />
                                      </div>
                                      <PrimitiveButton>
                                        <PrimitiveSpanText text="Select District" additionalClassNames="w-[92.638px]" />
                                        <Icon />
                                      </PrimitiveButton>
                                    </div>
                                    <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-[351.1px] top-0 w-[335.1px]" data-name="Container">
                                      <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
                                        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[14px] left-0 not-italic text-[#020617] text-[14px] top-[0.4px] whitespace-nowrap">{`State `}</p>
                                        <RegisterPatientPageText text="*" additionalClassNames="left-[43.54px]" />
                                      </div>
                                      <PrimitiveButton>
                                        <PrimitiveSpanText text="Select State" additionalClassNames="w-[80.488px]" />
                                        <Icon />
                                      </PrimitiveButton>
                                    </div>
                                  </div>
                                  <div className="content-stretch flex flex-col gap-[8px] h-[58px] items-start relative shrink-0 w-full" data-name="Container">
                                    <PrimitiveLabelText text="PIN Code" />
                                    <InputText text="Enter 6-digit PIN code" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="content-stretch flex flex-col gap-[16px] h-[169px] items-start relative shrink-0 w-full" data-name="Container">
                              <HeadingText text="Visit Details" />
                              <div className="h-[132px] relative shrink-0 w-full" data-name="Container">
                                <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-0 top-0 w-[335.1px]" data-name="Container">
                                  <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
                                    <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[14px] left-0 not-italic text-[#020617] text-[14px] top-[0.4px] whitespace-nowrap">{`Department `}</p>
                                    <RegisterPatientPageText text="*" additionalClassNames="left-[88.14px]" />
                                  </div>
                                  <PrimitiveButton>
                                    <PrimitiveSpanText text="Select department" additionalClassNames="w-[123.063px]" />
                                    <Icon />
                                  </PrimitiveButton>
                                </div>
                                <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-[351.1px] top-0 w-[335.1px]" data-name="Container">
                                  <PrimitiveLabelText text="Room Number" />
                                  <Input />
                                </div>
                                <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-0 top-[74px] w-[335.1px]" data-name="Container">
                                  <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
                                    <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[14px] left-0 not-italic text-[#020617] text-[14px] top-[0.4px] whitespace-nowrap">{`Doctor `}</p>
                                    <RegisterPatientPageText text="*" additionalClassNames="left-[53.43px]" />
                                  </div>
                                  <PrimitiveButton>
                                    <PrimitiveSpanText text="Select Doctor" additionalClassNames="w-[90.213px]" />
                                    <Icon />
                                  </PrimitiveButton>
                                </div>
                                <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-[351.1px] top-[74px] w-[335.1px]" data-name="Container">
                                  <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
                                    <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[14px] left-0 not-italic text-[#020617] text-[14px] top-[0.4px] whitespace-nowrap">{`Visit Type `}</p>
                                    <RegisterPatientPageText text="*" additionalClassNames="left-[74.23px]" />
                                  </div>
                                  <PrimitiveButton>
                                    <PrimitiveSpanText text="Select Visit Type" additionalClassNames="w-[110.45px]" />
                                    <Icon />
                                  </PrimitiveButton>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#e2e8f0] h-0 shrink-0 w-px" data-name="Primitive.div" />
                        <div className="bg-white h-[777px] relative rounded-[12px] shrink-0 w-[320px]" data-name="Card">
                          <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start p-[0.8px] relative size-full">
                            <Wrapper2 additionalClassNames="h-[50px] w-[318.4px]">
                              <div className="absolute h-[20px] left-[24px] top-[24px] w-[270.4px]" data-name="CardTitle">
                                <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#020617] text-[20px] top-[-0.4px] whitespace-nowrap">{`Today's Statistics`}</p>
                              </div>
                            </Wrapper2>
                            <div className="h-[338.4px] relative shrink-0 w-[318.4px]" data-name="CardContent">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start px-[24px] relative size-full">
                                <RegisterPatientPage>
                                  <TextText text="Total Visits" additionalClassNames="w-[72.175px]" />
                                  <TextText1 text="8" />
                                </RegisterPatientPage>
                                <RegisterPatientPage>
                                  <TextText text="New Patient Registrations" additionalClassNames="w-[171.25px]" />
                                  <TextText1 text="7" />
                                </RegisterPatientPage>
                                <RegisterPatientPage>
                                  <TextText text="Follow Up Patient Registrations" additionalClassNames="w-[206.15px]" />
                                  <TextText1 text="1" />
                                </RegisterPatientPage>
                                <RegisterPatientPage>
                                  <TextText text="Doctor Pending Consultations" additionalClassNames="w-[197.338px]" />
                                  <TextText1 text="3" />
                                </RegisterPatientPage>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[36.8px] relative shrink-0 w-[1118.4px]" data-name="GlobalFooter">
              <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t-[0.8px] inset-0 pointer-events-none" />
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8.8px] px-[47.2px] relative size-full">
                <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                  <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] top-[0.6px] whitespace-nowrap">© 2026 IQLine Inc. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </Wrapper3>
      </div>
      <div className="absolute border-[#e2e8f0] border-r-[0.8px] border-solid h-[729.6px] left-0 top-0 w-[48px]" data-name="Sidebar">
        <div className="absolute bg-[#f1f5f9] content-stretch flex flex-col h-[729.6px] items-start left-0 top-0 w-[47.2px]" data-name="Container">
          <div className="h-[48px] relative shrink-0 w-[47.2px]" data-name="SidebarHeader">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[8px] py-[8px] relative size-full">
              <Wrapper3 additionalClassNames="w-[31.2px]">
                <div className="absolute h-[32px] left-0 top-0 w-[31.2px]" data-name="SidebarMenuItem">
                  <div className="absolute content-stretch flex items-center justify-center left-0 px-[2px] rounded-[6px] size-[32px] top-0" data-name="SlotClone">
                    <div className="relative shrink-0 size-[28px]" data-name="LogoIcon">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
                        <g clipPath="url(#clip0_4009_881)" id="LogoIcon">
                          <path d={svgPaths.pb4f5570} fill="var(--fill-0, #4A4C60)" id="Vector" />
                          <path d={svgPaths.p159b4380} fill="var(--fill-0, #4A4C60)" id="Vector_2" />
                          <path d={svgPaths.p2870ff80} fill="var(--fill-0, #3AA9A0)" id="Vector_3" />
                          <path d={svgPaths.p28e40600} fill="var(--fill-0, #3AA9A0)" id="Vector_4" />
                          <path d={svgPaths.p1efc7df2} fill="var(--fill-0, #2E8981)" id="Vector_5" />
                        </g>
                        <defs>
                          <clipPath id="clip0_4009_881">
                            <rect fill="white" height="28" width="28" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </Wrapper3>
            </div>
          </div>
          <div className="flex-[620.112_0_0] min-h-px min-w-px relative w-[47.2px]" data-name="SidebarContent">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
              <div className="absolute content-stretch flex flex-col h-[48px] items-start left-0 pl-[8px] py-[8px] top-0 w-[47.2px]" data-name="SidebarGroup">
                <Wrapper3 additionalClassNames="w-[31.2px]">
                  <div className="absolute h-[32px] left-0 top-0 w-[31.2px]" data-name="SidebarMenuItem">
                    <div className="absolute content-stretch flex items-center left-0 overflow-clip px-[8px] rounded-[6px] size-[32px] top-0" data-name="Link">
                      <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="Icon">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                          <div className="absolute bottom-1/4 left-[62.5%] right-[12.5%] top-1/2" data-name="Vector">
                            <div className="absolute inset-[-16.67%]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 5.33333">
                                <path d={svgPaths.p36446d40} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute inset-[12.5%_45.83%_54.17%_20.83%]" data-name="Vector">
                            <div className="absolute inset-[-12.5%]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 6.66667">
                                <path d={svgPaths.p31080000} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute inset-[62.5%_58.33%_12.5%_8.33%]" data-name="Vector">
                            <div className="absolute inset-[-16.67%_-12.5%]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 5.33333">
                                <path d={svgPaths.pd09b480} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute inset-[67.08%_9.58%_31.67%_86.67%]" data-name="Vector">
                            <div className="absolute inset-[-333.42%_-111.14%]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.9337 1.53369">
                                <path d={svgPaths.pc163f00} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute inset-[56.67%_36.67%_42.08%_59.58%]" data-name="Vector">
                            <div className="absolute inset-[-333.42%_-111.14%]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.93369 1.53369">
                                <path d={svgPaths.pc163f00} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute inset-[74.17%_29.58%_22.08%_69.17%]" data-name="Vector">
                            <div className="absolute inset-[-111.14%_-333.42%]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.53369 1.9337">
                                <path d={svgPaths.pfc16900} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute inset-[47.08%_19.17%_49.17%_79.58%]" data-name="Vector">
                            <div className="absolute inset-[-111.14%_-333.42%]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.53369 1.93369">
                                <path d={svgPaths.pfc16900} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                              </svg>
                            </div>
                          </div>
                          <Icon13Vector additionalClassNames="inset-[73.75%_18.33%_22.08%_80%]" />
                          <Icon13Vector additionalClassNames="inset-[47.08%_30%_48.75%_68.33%]" />
                          <div className="absolute inset-[67.5%_36.25%_30.83%_59.58%]" data-name="Vector">
                            <div className="absolute inset-[-250.07%_-100.03%]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.00035 1.60035">
                                <path d={svgPaths.p19c4d000} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute inset-[55.83%_9.58%_42.5%_86.25%]" data-name="Vector">
                            <div className="absolute inset-[-250.07%_-100.03%]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.00035 1.60036">
                                <path d={svgPaths.p4c72d80} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Wrapper3>
              </div>
            </div>
          </div>
          <div className="h-[61.487px] relative shrink-0 w-[47.2px]" data-name="SidebarFooter">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[8px] py-[8px] relative size-full">
              <Wrapper3 additionalClassNames="w-[31.2px]">
                <div className="absolute h-[45.487px] left-0 top-0 w-[31.2px]" data-name="SidebarMenuItem">
                  <div className="absolute h-[45.487px] left-0 rounded-[6px] top-0 w-[31.2px]" data-name="SlotClone">
                    <div className="absolute h-[33.487px] left-[48px] top-[6px] w-0" data-name="GlobalSidebar" />
                    <div className="absolute content-stretch flex items-start left-[8px] overflow-clip rounded-[8px] size-[32px] top-[6.74px]" data-name="Primitive.span">
                      <div className="bg-[#f1f5f9] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[8px]" data-name="Text">
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[8px] relative size-full">
                            <Icon1 additionalClassNames="relative shrink-0">
                              <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                              <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            </Icon1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Wrapper3>
            </div>
          </div>
        </div>
        <div className="absolute h-[729.6px] left-[39.2px] top-0 w-[16px]" data-name="SidebarRail" />
      </div>
    </div>
  );
}