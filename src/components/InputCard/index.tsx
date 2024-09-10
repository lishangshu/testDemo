import React, { useState } from 'react';
import Image from 'next/image';
import InputBalance from '@/components/InputBalance';
import { formatUsdt } from '../../commons/utils';
import moment from 'moment'
import {
	formatUnits
} from 'viem'

interface InputCardProps {
    logo: string;
    coinName: string;
    rate: number;
    network: string;
	apy: number;
	cycle: number;
	maturity: string;
	onChange: (value: number) => void;
}

const InputCard: React.FC<InputCardProps> = ({ logo, coinName, rate, network, apy, cycle, maturity, onChange }) => {
	const [dailyEarn, setDailyEarn] = useState(0)
	const [totalEarn, setTotalEarn] = useState(0)
	
	const d = moment(maturity).diff(moment(), 'days')
	const [points, setPoints] = useState(parseInt(100 / cycle * d))
	function inputChange(value) {
		setDailyEarn(formatUsdt((value || 0) * (apy || 0) / 100 / 365, 4))
		setTotalEarn(formatUsdt((value || 0) * (cycle || 30) * (apy || 0) / 100 / 365, 4))
		onChange && onChange(value)
	}
    return (
        <div className="w-full h-[312px] bg-market-card-bg shadow-card p-4 rounded-card mb-[6px] text-primary">
            {/* 输入和余额部分 */}
            <InputBalance logo={logo} coinName={coinName} rate={rate} maxValue={100} onChange={inputChange} />

            {/* 估计收益和奖励部分 */}
            <div className='w-full flex flex-col items-center justify-around text-secondary font-500 px-[52px]'>
                <div className='w-full flex items-center justify-between'>
                    <span className='text-[12px]'>Est.daily</span>
                    <span className='text-[14px] text-primary'>{dailyEarn} USDT</span>
                </div>
                <div className='w-full flex items-center justify-between'>
                    <span className='text-[12px]'>Est.receive</span>
                    <span className='text-[14px] text-primary'>{totalEarn}</span>
                </div>
                <div className='w-full flex items-center justify-between'>
                    <span className='text-[12px]'>Est.Points reward</span>
                    <span className='text-[14px] text-primary'>{points}</span>
                </div>
            </div>

            {/* 分隔线 */}
            <div className="w-full h-[1px] bg-[#ededed] mt-[25px]"></div>

            {/* 网络信息 */}
            <div className='mt-[12px] flex items-center justify-between text-secondary px-[52px]'>
                <span className='text-[12px]'>Network</span>
                <div className="flex items-center gap-[2px]">
                    <Image src={'/eth.svg'} width={16} height={16} alt='eth' />
                    <p className="text-primary text-desc font-500">{network}</p>
                </div>
            </div>
        </div>
    );
};

export default InputCard;