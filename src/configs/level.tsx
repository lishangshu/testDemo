export const levelDataSource = [
    {
        level: 'Level 1',
        basicReward: '10',
        extraReward: '1',
    },
    {
        level: 'Level 2',
        basicReward: '10',
        extraReward: '1',
    },
    {
        level: 'Level 3',
        basicReward: '10',
        extraReward: '1',
    },
    {
        level: 'Level 4',
        basicReward: '10',
        extraReward: '1',
    },
    {
        level: 'Level 5',
        basicReward: '10',
        extraReward: '1',
    },
    {
        level: 'Level 6',
        basicReward: '10',
        extraReward: '1',
    },
]

export const levelColumns = [
    {
        title: 'Level',
        dataIndex: 'level',
        key: 'level',
    },
    {
        title: 'Basic Reward',
        dataIndex: 'basicReward',
        key: 'basicReward',
        render: (value: any) => {
            return (
                <span className="text-[16px] font-400">{value} pt/user</span>
            )
        }
    },
    {
        title: 'Extra Reward',
        dataIndex: 'extraReward',
        key: 'extraReward',
        render: (value: any) => {
            return (
                <span className="text-[16px] font-400">+ {value * 100}% pt/user</span>
            )
        }
    },
]