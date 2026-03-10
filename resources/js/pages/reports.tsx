import { Head } from '@inertiajs/react';
import { motion } from 'motion/react';
import type { ReactElement } from 'react';
import Layout from './layout';

export default function Reports(): ReactElement {
    return (
        <>
            <Head title="Reports" />

            <Layout currentPage="reports" title="Reports">
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                    className="rounded-[28px] border border-[#1B212C] bg-[#11161D] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                >
                    <div className="max-w-[640px]">
                        <span className="inline-flex rounded-full border border-[#24303B] bg-[#171E27] px-3 py-1 text-[12px] font-medium tracking-[0.14em] text-[#B5F955] uppercase">
                            TODO
                        </span>
                        <h1 className="mt-5 font-['Space_Grotesk'] text-[42px] leading-none font-medium tracking-[-0.05em] text-white">
                            Relatórios
                        </h1>
                        <p className="mt-4 text-[16px] leading-7 text-[#9AA3AF]">
                            Esta área vai concentrar a visão detalhada de
                            despesas por categoria e período. A rota já está
                            pronta para ser conectada ao dashboard e receber o
                            relatório completo no próximo passo.
                        </p>
                    </div>
                </motion.section>
            </Layout>
        </>
    );
}
