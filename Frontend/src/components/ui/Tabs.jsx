import "./Tabs.css";

function Tabs({
    tabs,
    activeTab,
    onChange,
}) {
    return (
        <div className="tabs">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={`tab-button ${activeTab === tab ? "active" : ""
                        }`}
                    onClick={() => onChange(tab)}
                    role="tab"
                    aria-selected={activeTab === tab}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}

export default Tabs;