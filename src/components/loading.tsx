import './loading.css';

const Loading: React.FC = () => {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
            <p className="loading-message">Hold on to your forks...</p>
        </div>
    );
};

export default Loading;