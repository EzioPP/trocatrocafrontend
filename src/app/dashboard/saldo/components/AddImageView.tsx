type AddImageProps = {
    sendShowComponent: (showComponent: string) => void;
};

export default function AddImageView({ sendShowComponent }: AddImageProps): JSX.Element {

    const handleShowComponent = () => {
        sendShowComponent("none");
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-stone-900 p-4 rounded shadow-md flex flex-col space-y-4">
                <label className="text-sm text-accent ">Selecione a imagem</label>
                <input type="file" accept="image/jpg" onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (!file) return;
                    const formData = new FormData();
                    formData.append("image", file);
                    console.log("let this be FORMDATA", formData);
                    fetch("http://localhost:5015/api/image/client/profile", {
                        method: "POST",
                        body: formData,
                        credentials: 'include',
                    });
                    handleShowComponent();
                    location.reload();
                }
                } />
                <button
                    className="bg-rose-800 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleShowComponent}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}

