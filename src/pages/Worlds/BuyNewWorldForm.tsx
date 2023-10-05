import {useState} from "react";
import {useWalletStore} from "../../store/useWalletStore";
import {useGameStore} from "../../store/useGameStore";
import {Button, Card, Flex, TextField} from "@radix-ui/themes";
import {Cross1Icon, GlobeIcon} from "@radix-ui/react-icons";
import {chainNetworkParams} from "../../utils/chainNetworkParams";
import * as Form from "@radix-ui/react-form";
import Loader from "../../components/loader/Loader";

const BuyNewWorldForm = ({getProfileWorlds}: { getProfileWorlds: any }) => {
    const [worldName, setWorldName] = useState('')
    const [isOpenCreateForm, setIsOpenCreateForm] = useState(false)
    const {contractWrite} = useWalletStore()
    const [isLoadingCreateWorld, setIsLoadingCreateWorld] = useState(false)
    const {worldPrice} = useGameStore()

    const handleCreateWorld = async (data: { worldName: string }) => {
        setIsLoadingCreateWorld(true)
        try {
            const tx = await contractWrite?.createWorld(data?.worldName, {
                value: worldPrice
            })
            await tx.wait();
            getProfileWorlds()
            setIsLoadingCreateWorld(false)
            setWorldName('')
            setIsOpenCreateForm(false)
        } catch (e) {
            console.log(e)
            setIsLoadingCreateWorld(false)
        }
    }


    return <Flex mb={'2'} mt={'2'} gap={'3'} direction={'column'} align={'start'}>
        {!isOpenCreateForm &&
            <Flex gap={'5'} align={'center'} justify={'end'}>
                <Button
                    disabled={isLoadingCreateWorld}
                    variant={"surface"}
                    onClick={() => {
                        setIsOpenCreateForm(true)
                    }}
                >
                    <GlobeIcon/>
                    Create new world
                    {' | '}
                    {parseInt(worldPrice) / 10 ** 18}
                    {' '}
                    {chainNetworkParams.nativeCurrency.symbol}
                </Button>
            </Flex>
        }

        {isOpenCreateForm &&
            <Card style={{borderWidth: 2, width: '100%'}}>
                <Form.Root
                    className="FormRoot"
                    onSubmit={(event) => {
                        const data = Object.fromEntries(new FormData(event.currentTarget));
                        event.preventDefault();
                        // @ts-ignore
                        handleCreateWorld(data)
                    }}
                >
                    <Flex gap={'3'} justify={'start'} align={'start'}>
                        <Form.Field style={{width: '100%'}} className="FormField" name="worldName">
                            <Form.Control asChild>
                                <TextField.Input
                                    disabled={isLoadingCreateWorld}
                                    value={worldName}
                                    onChange={e => setWorldName(e.target.value)}
                                    placeholder={'World title'} className="Textarea"
                                    required
                                />
                            </Form.Control>
                            <div style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                justifyContent: 'space-between'
                            }}>
                                <Form.Message
                                    className="FormMessage"
                                    match="valueMissing"
                                >
                                </Form.Message>
                            </div>
                        </Form.Field>
                        <Form.Submit asChild>
                            {isLoadingCreateWorld
                                ? <Flex align={'center'} justify={'center'}>
                                    <Loader size={'sm'}/>
                                </Flex>
                                : <>
                                    <Button
                                        disabled={isLoadingCreateWorld}
                                        className="Button"
                                    >
                                        Create
                                    </Button>
                                    <Flex gap={'5'} align={'center'} justify={'start'}>
                                        <Button
                                            variant={"surface"}
                                            color={'red'}
                                            onClick={() => {
                                                setIsOpenCreateForm(false)
                                                setWorldName('')
                                            }}
                                        >
                                            <Cross1Icon/>
                                            Close
                                        </Button>
                                    </Flex>
                                </>
                            }
                        </Form.Submit>
                    </Flex>
                </Form.Root>
            </Card>
        }
    </Flex>
}

export default BuyNewWorldForm