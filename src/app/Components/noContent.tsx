
interface NoContentProps {
    readonly title: string;
    readonly description: string;
}

function NoContent({ title, description }: NoContentProps) {
    return ( 
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-600">
          <p className="text-lg font-medium mb-2">{title}</p>
          <p>{description}</p>
        </div>
     );
}

export default NoContent;