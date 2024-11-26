type AddReportView = {
    sendShowComponent: (showComponent: string) => void;
};

export default function AddReportView({ sendShowComponent }: AddReportView): JSX.Element {

    const handleShowComponent = () => {
        sendShowComponent("none");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);



        const startDate = formData.get("startDate");
        const endDate = formData.get("endDate");

        const dateString = `${startDate} - ${endDate}`;

        const response = await fetch('http://localhost:5015/api/report/client/byDate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ dateString }),
        });

        if (response.ok) {
            handleShowComponent();
            location.reload();
        } else {
            console.error('Failed to fetch balance');
        }

    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-stone-900 p-4 rounded shadow-md flex flex-col space-y-4">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <label className="text-sm text-accent">Selecione o periodo</label>
                    <input type="date" name="startDate" className="p-2 bg-dark text-white rounded-md" />
                    <input type="date" name="endDate" className="p-2 bg-dark text-white rounded-md" />
                    <input type="submit" value="Enviar" className="p-2 bg-blue-500 rounded cursor-pointer text-accent" />
                </form>

            </div>

        </div>
    );
}

